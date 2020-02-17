module.exports = {
	baseUrl: process.env.NODE_ENV === 'production'
		? '/smartidcur/tools/'
		: '/',
	pages: {
		index: {
			// точка входа для страницы
			entry: 'src/main.js',
			// исходный шаблон
			template: 'public/index.html',
			// в результате будет dist/index.html
			filename: 'index.html',
			// все фрагменты, добавляемые на этой странице, по умолчанию
			// это извлечённые общий фрагмент и вендорный фрагмент.
			chunks: ['chunk-vendors', 'chunk-common', 'index']
		},
		callback: {
			// точка входа для страницы
			entry: 'src/callback.js',
			// исходный шаблон
			template: 'public/index.html',
			// в результате будет dist/index.html
			filename: 'callback.html',
			// все фрагменты, добавляемые на этой странице, по умолчанию
			// это извлечённые общий фрагмент и вендорный фрагмент.
			chunks: ['chunk-vendors', 'chunk-common', 'callback']
		},
		callbackrenew: {
			// точка входа для страницы
			entry: 'src/callbackrenew.js',
			// исходный шаблон
			template: 'public/index.html',
			// в результате будет dist/index.html
			filename: 'callbackrenew.html',
			// все фрагменты, добавляемые на этой странице, по умолчанию
			// это извлечённые общий фрагмент и вендорный фрагмент.
			chunks: ['chunk-vendors', 'chunk-common', 'callbackrenew']
		},
		callbacksignout: {
			// точка входа для страницы
			entry: 'src/callbacksignout.js',
			// исходный шаблон
			template: 'public/index.html',
			// в результате будет dist/index.html
			filename: 'callbacksignout.html',
			// все фрагменты, добавляемые на этой странице, по умолчанию
			// это извлечённые общий фрагмент и вендорный фрагмент.
			chunks: ['chunk-vendors', 'chunk-common', 'callbacksignout']
		},
	}
}