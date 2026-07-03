import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let pluginsRegistered = false;

/** Register GSAP plugins once (client-only). */
export function registerGsapPlugins(): void {
	if (pluginsRegistered || typeof window === "undefined") {
		return;
	}

	gsap.registerPlugin(ScrollTrigger, SplitText);
	pluginsRegistered = true;
}

export { gsap, ScrollTrigger, SplitText };
