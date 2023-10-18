// https://www.npmjs.com/package/audio-buffer-utils
declare module "audio-buffer-utils" {
  /**
   * @see https://github.com/audiojs/audio-buffer-utils#utilconcatbuffer1-buffer2-buffer3-buffern-
   * @return a new buffer
   */
  function concat(...buffers: AudioBuffer[]): AudioBuffer;

  /**
   * @see https://github.com/audiojs/audio-buffer-utils#utilclonebuffer
   * @return a new buffer
   */
  function clone(buffer: AudioBuffer): AudioBuffer;

  /**
   * @see https://github.com/audiojs/audio-buffer-utils#utilmixbuffera-bufferb-ratiovala-valb-i-channelval-offset0
   * @return **modified** bufferA
   */
  function mix(
    bufferA: AudioBuffer,
    bufferB: AudioBuffer,
    mixingFn: (
      valA: number,
      valB: number,
      i: number,
      channel: number,
    ) => number,
  ): AudioBuffer;

  /**
   * @see https://github.com/audiojs/audio-buffer-utils#utilresizebuffer-length
   * @return a new buffer
   */
  function resize(buffer: AudioBuffer, length: number): AudioBuffer;
}
