const docgen = require('react-tsdoc');
const path = require('path');
const tsmorph = require('ts-morph');

const defaultOptions = {
	injectAt: '__docgenInfo',
	docgenOptions: {}
};

/**
 * Inject docgen results into components
 *
 * @param content - Source string for the component
 * @param docs - Generated docs for the component
 * @param injectAt - Component property to add the docs to
 * @param filePath - Relative component file path
 */
const inject = (content, docs, injectAt, filePath) => {
	const project = new tsmorph.Project({ useInMemoryFileSystem: true });
	const sourceFile = project.createSourceFile('./tmp.tsx', content);
	const exportedDeclarations = sourceFile.getExportedDeclarations();

	exportedDeclarations.forEach((exported) => {
		defaultExport = exported.find((node) => {
			try {
				if (node.getKind() === tsmorph.SyntaxKind.VariableDeclaration && node.isDefaultExport()) {
					const name = node.getName();

					sourceFile.addStatements(`
						if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {\n
							STORYBOOK_REACT_CLASSES["${filePath}"] = {\n
								name: "${name}",\n
								docgenInfo: ${name}.${injectAt},\n
								path: "${filePath}"\n
							}
						}
						${name}.${defaultOptions.injectAt} = ${JSON.stringify(docs[filePath])}
					`);
				}
			} catch (e) {
				console.log(e);
				return false;
			}
		});
	});

	return sourceFile.print();
};

module.exports = async function (content, map) {
	const callback = this.async();

	try {
		const options = {
			...defaultOptions
		}

		const docs = docgen.default(this.resourcePath, null, false);
		const filePath = path.relative(this.rootContext, this.resourcePath);

	  callback(null, inject(content, docs, options.injectAt, filePath), map);
	} catch (e) {
		if (e instanceof Error) {
			e.message = `[react-tsdoc-loader] failed to parse the component file. ${e.message}`;
		}

		console.log(e);

		this.emitWarning(e);
		callback(null, content, map);
	}
};
