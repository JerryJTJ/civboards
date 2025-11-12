interface Options {
	simple?: boolean;
	api?: boolean;
	outputCompressed?: boolean;
}

export function parse(buffer: Buffer, options: Options): any;
