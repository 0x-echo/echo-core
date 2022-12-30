import { terser } from 'rollup-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from 'rollup-plugin-replace'
import analyze from 'rollup-plugin-analyzer'

export default [
	{
		input: 'index.js',
		output: {
			file: 'dist/index.esm.js',
			format: 'esm',
			name: 'EchoCore'
		},
		plugins: [
			json(),
			commonjs(),
			nodeResolve({
				browser: true
			}),
			terser({})
		]
	},
	{
		input: 'index.js',
		output: {
			file: 'dist/index.min.js',
			format: 'umd',
			exports: 'default',
			name: 'EchoCore'
		},
		plugins: [
			replace({
				'process.env.NODE_ENV': JSON.stringify('production')
			}),
			json(),
			commonjs(),
			nodeResolve({
				browser: true
			}),
			terser({}),
			analyze({
				summaryOnly: true
			})
		]
	},
	{
		input: 'login.js',
		output: {
			file: 'dist/login.min.js',
			format: 'umd',
			exports: 'default',
			name: 'EchoLogin'
		},
		plugins: [
			replace({
				'process.env.NODE_ENV': JSON.stringify('production')
			}),
			json(),
			commonjs(),
			nodeResolve({
				browser: true
			}),
			terser({}),
			analyze({
				summaryOnly: true
			})
		]
	}
]
