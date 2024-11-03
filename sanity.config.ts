'use client'

import { defineConfig } from 'sanity'
import { projectId, dataset } from '@/sanity/lib/env'
import { structureTool } from 'sanity/structure'
import { structure } from './src/sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { resolve } from './src/sanity/presentation/resolve'
import {
	dashboardTool,
	projectInfoWidget,
	projectUsersWidget,
} from '@sanity/dashboard'
import { sanitypressGuideWidget } from './src/sanity/sanitypressGuideWidget'
import { vercelWidget } from 'sanity-plugin-dashboard-widget-vercel'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './src/sanity/schemas'

const singletonTypes = ['site']

export default defineConfig({
	projectId,
	dataset,
	basePath: '/admin',

	plugins: [
		structureTool({
			name: 'content',
			title: 'Content',
			structure,
		}),
		presentationTool({
			name: 'editor',
			title: 'Editor',
			previewUrl: {
				previewMode: {
					enable: '/api/draft-mode/enable',
				},
			},
			resolve,
		}),
		dashboardTool({
			name: 'deployment',
			title: 'Deployment',
			widgets: [vercelWidget()],
		}),
		dashboardTool({
			name: 'info',
			title: 'Info',
			widgets: [
				projectInfoWidget(),
				projectUsersWidget(),
				sanitypressGuideWidget(),
			],
		}),
		visionTool(),
		codeInput(),
	],

	tasks: { enabled: false },
	scheduledPublishing: { enabled: false },

	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(
				({ schemaType }) => !singletonTypes.includes(schemaType),
			),
	},

	document: {
		actions: (input, { schemaType }) =>
			singletonTypes.includes(schemaType)
				? input.filter(
						({ action }) =>
							action &&
							['publish', 'discardChanges', 'restore'].includes(action),
					)
				: input,
	},
})