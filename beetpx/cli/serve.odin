package beetpx_cli

import "core:fmt"
import "core:net"
import "core:os"
import "core:strings"
import "core:thread"
import "core:time"

@(private = "file")
_PORT :: 8000

// How long to wait for a request on a connection the browser opened ahead of
// time, but has not used.
@(private = "file")
_RECV_TIMEOUT :: 5 * time.Second

// Serves the files of a directory at <http://127.0.0.1:8000>, until the CLI is
// stopped. It is meant for local development only: it reads the files on every
// request, tells the browser not to cache them, and handles `GET` and `HEAD`
// only.
@(private)
_serve :: proc(dir: string) -> bool {
	socket, listen_err := net.listen_tcp({net.IP4_Loopback, _PORT})
	if listen_err != nil {
		fmt.eprintfln("Failed to listen on port %d: %v", _PORT, listen_err)
		return false
	}
	defer net.close(socket)

	fmt.printfln("Serving %s at http://127.0.0.1:%d ...", dir, _PORT)
	for {
		client, _, accept_err := net.accept_tcp(socket)
		if accept_err != nil {
			fmt.eprintfln("Failed to accept a connection: %v", accept_err)
			continue
		}
		// A thread per connection, so that a connection the browser keeps idle
		// does not block the others.
		thread.create_and_start_with_poly_data2(
			client,
			dir,
			proc(client: net.TCP_Socket, dir: string) {
				_serve_connection(client, dir)
				net.close(client)
				free_all(context.temp_allocator)
			},
			self_cleanup = true,
		)
	}
}

@(private = "file")
_serve_connection :: proc(client: net.TCP_Socket, dir: string) {
	_ = net.set_option(client, .Receive_Timeout, _RECV_TIMEOUT)

	// Only the request line matters, so a single read is enough.
	buf: [4096]byte
	n, recv_err := net.recv_tcp(client, buf[:])
	if recv_err != nil || n == 0 {
		return
	}
	request_line, _, _ := strings.partition(string(buf[:n]), "\r\n")
	parts := strings.fields(request_line, context.temp_allocator)
	if len(parts) != 3 {
		_respond(client, 400, "Bad Request")
		return
	}
	method, target := parts[0], parts[1]
	if method != "GET" && method != "HEAD" {
		_respond(client, 405, "Method Not Allowed")
		return
	}

	encoded_path, _, _ := strings.partition(target, "?")
	url_path, decoded := net.percent_decode(
		encoded_path,
		context.temp_allocator,
	)
	if url_path == "/" {
		url_path = "/index.html"
	}
	// Keeps the requests inside the served directory.
	if !decoded ||
	   !strings.has_prefix(url_path, "/") ||
	   strings.contains(url_path, "..") {
		_respond(client, 404, "Not Found")
		fmt.printfln("%s %s 404", method, target)
		return
	}

	data, read_err := os.read_entire_file(
		strings.concatenate({dir, url_path[1:]}, context.temp_allocator),
		context.temp_allocator,
	)
	if read_err != nil {
		_respond(client, 404, "Not Found")
		fmt.printfln("%s %s 404", method, target)
		return
	}

	header := fmt.tprintf(
		"HTTP/1.1 200 OK\r\n" +
		"Content-Type: %s\r\n" +
		"Content-Length: %d\r\n" +
		"Cache-Control: no-store\r\n" +
		"Connection: close\r\n" +
		"\r\n",
		_content_type(url_path),
		len(data),
	)
	if _, err := net.send_tcp(client, transmute([]byte)header); err != nil {
		return
	}
	if method == "GET" {
		if _, err := net.send_tcp(client, data); err != nil {
			return
		}
	}
	fmt.printfln("%s %s 200", method, target)
}

@(private = "file")
_respond :: proc(client: net.TCP_Socket, status: int, reason: string) {
	response := fmt.tprintf(
		"HTTP/1.1 %d %s\r\n" +
		"Content-Type: text/plain; charset=utf-8\r\n" +
		"Content-Length: %d\r\n" +
		"Connection: close\r\n" +
		"\r\n" +
		"%s",
		status,
		reason,
		len(reason),
		reason,
	)
	_, _ = net.send_tcp(client, transmute([]byte)response)
}

@(private = "file")
_content_type :: proc(path: string) -> string {
	switch os.ext(path) {
	case ".html":
		return "text/html; charset=utf-8"
	case ".js":
		return "text/javascript; charset=utf-8"
	case ".css":
		return "text/css; charset=utf-8"
	case ".json":
		return "application/json"
	case ".wasm":
		return "application/wasm"
	case ".png":
		return "image/png"
	case ".svg":
		return "image/svg+xml"
	case ".ico":
		return "image/x-icon"
	case ".wav":
		return "audio/wav"
	case ".mp3":
		return "audio/mpeg"
	case ".ogg":
		return "audio/ogg"
	case ".flac":
		return "audio/flac"
	case:
		return "application/octet-stream"
	}
}
