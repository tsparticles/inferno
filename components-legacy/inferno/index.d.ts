// Type definitions for inferno-particles
// Project: https://github.com/matteobruni/tsparticles
// Definitions by: Matteo Bruni <https://github.com/matteobruni>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="inferno" />
import type { Component, RefObject } from "inferno";
import type { Container, ISourceOptions, Engine } from "tsparticles-engine";

export interface IParticlesProps {
	id?: string;
	width?: string;
	height?: string;
	options?: ISourceOptions;
	url?: string;
	params?: ISourceOptions;
	style?: CSSProperties;
	className?: string;
	canvasClassName?: string;
	container?: RefObject<Container>;
	init?: (engine: Engine) => Promise<void>;
	loaded?: (container: Container) => Promise<void>;
}

export interface IParticlesState {
	library?: Container;
}

export type IParticlesParams = IParticlesProps;
export type ParticlesProps = IParticlesProps;

type Particles = Component<IParticlesProps, IParticlesState>;

declare const Particles: Particles;

export default Particles;
