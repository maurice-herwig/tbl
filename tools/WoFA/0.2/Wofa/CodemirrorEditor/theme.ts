import {boysAndGirls, createTheme} from 'thememirror';
import {tags as t} from '@lezer/highlight';
// '#f6f8fa'
export const lightTheme = createTheme({
	variant: 'light',
	settings: {
		background: '#ffffff',
		foreground: '#000000',
		caret: '#000000',
		selection: '#e7e8e9',
		lineHighlight: '#8a91991a',
		gutterBackground: '#fcfcfd',
		gutterForeground: '#ababab',
	},
	styles: [
		{
			tag: t.heading1,
			color: "darkblue",
			'font-weight': 800,
			'text-decoration': "underline",
		},
		{
			tag: t.heading2,
			color: "darkblue",
			'font-weight': 800,
			'text-decoration': "underline",
		},
		{
			tag: t.heading3,
			color: "darkblue",
			'font-weight': 800,
		},
		{
			tag: t.heading,
			color: "darkblue",
		},
		{
			tag: t.comment,
			color: '#363636',
		},
		{
			tag: t.variableName,
			color: '#000000',
		},
		{
			tag: [t.string, t.special(t.brace)],
			color: '#db000f',
		},
		{
			tag: t.number,
			color: '#005721',
		},
		{
			tag: t.bool,
			color: '#005721',
		},
		{
			tag: t.null,
			color: '#db000f',
		},
		{
			tag: t.keyword,
			color: '#b3008c',
		},
		{
			tag: t.operator,
			color: '#000000',
		},
		{
			tag: t.className,
			color: '#000000',
		},
		{
			tag: t.definition(t.typeName),
			color: '#000000',
		},
		{
			tag: t.typeName,
			color: '#800033',
		},
		{
			tag: t.angleBracket,
			color: '#474747',
		},
		{
			tag: t.tagName,
			color: '#006110',
		},
		{
			tag: t.attributeName,
			color: '#0050b3',
		},
	],
});