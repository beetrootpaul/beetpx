package beetpx_bpx

// TODO: Should we order it xy,wh or wh,xy? xy changes more often, so maybe good
//       to have it last. But consistncy across draw API would be probably xy
//       first.

// TODO: How to decide which struct fields should be prefixed with `_`? Take a
//       look at `Timer` for a comparison and look for some consistency across
//       structs and how are they used. Partially: private-within-lib vs
//       private-within-file.

Sprite :: struct {
	// TODO: How to make it clear that across entire BeetPx we identify images
	//       by their paths (and therefore the path has to be always the same,
	//       btw)?.
	// TODO: How to make sure the user assigned some image path here? And for
	//       any other struct in general. Should I always assumed zero-value
	//       being a valid option and guard in the runtime against it?
	image_path: string,
	xy        : Xy_Int,
	wh        : Xy_Int,
}
