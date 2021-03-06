import { Config, OutputTarget, PrerenderConfig, RenderOptions } from '../../declarations';
import { normalizePath } from '../util';


export function validatePrerender(config: Config, outputTarget: OutputTarget) {
  if (outputTarget.type !== 'www') {
    outputTarget.prerender = null;
    return;
  }

  if (outputTarget.prerender === false) {
    outputTarget.prerender = null;
    return;
  }

  if (config.flags.prerender) {
    outputTarget.prerender = outputTarget.prerender || {};
  }

  if (outputTarget.prerender) {
    // we already have a prerender config
    outputTarget.prerender = Object.assign({}, DEFAULT_SSR_CONFIG, DEFAULT_PRERENDER_CONFIG, outputTarget.prerender);

    if (typeof outputTarget.prerender.hydrateComponents !== 'boolean') {
      outputTarget.prerender.hydrateComponents = true;
    }

    if (!outputTarget.prerender.prerenderDir) {
      outputTarget.prerender.prerenderDir = outputTarget.dir;
    }

    if (!config.sys.path.isAbsolute(outputTarget.prerender.prerenderDir)) {
      outputTarget.prerender.prerenderDir = normalizePath(config.sys.path.join(config.rootDir, outputTarget.prerender.prerenderDir));
    }

    config.buildEs5 = true;

  } else if (outputTarget.prerender !== null && !config.devMode) {
    // don't have a prerender config
    // and it's prod mode
    outputTarget.prerender = {
      hydrateComponents: false,
      crawl: false,
      include: [
        { path: '/' }
      ],
      collapseWhitespace: DEFAULT_SSR_CONFIG.collapseWhitespace,
      inlineLoaderScript:  DEFAULT_SSR_CONFIG.inlineLoaderScript,
      inlineStyles: false,
      inlineAssetsMaxSize: DEFAULT_SSR_CONFIG.inlineAssetsMaxSize,
      includePathQuery: DEFAULT_PRERENDER_CONFIG.includePathQuery,
      includePathHash: DEFAULT_PRERENDER_CONFIG.includePathHash,
      maxConcurrent: DEFAULT_PRERENDER_CONFIG.maxConcurrent,
      removeUnusedStyles: false
    };

    if (!outputTarget.prerender.prerenderDir) {
      outputTarget.prerender.prerenderDir = outputTarget.dir;
    }

    if (!config.sys.path.isAbsolute(outputTarget.prerender.prerenderDir)) {
      outputTarget.prerender.prerenderDir = normalizePath(config.sys.path.join(config.rootDir, outputTarget.prerender.prerenderDir));
    }

  } else {
    outputTarget.prerender = null;
  }
}

export const DEFAULT_PRERENDER_CONFIG: PrerenderConfig = {
  crawl: true,
  include: [
    { path: '/' }
  ],
  includePathQuery: false,
  includePathHash: false,
  maxConcurrent: 4,
  hydrateComponents: true
};

export const DEFAULT_SSR_CONFIG: RenderOptions = {
  collapseWhitespace: true,
  inlineLoaderScript: true,
  inlineStyles: true,
  inlineAssetsMaxSize: 5000,
  removeUnusedStyles: true
};

export const DEFAULT_PRERENDER_HOST = 'prerender.stenciljs.com';
