interface ChandelierMarkupProps {
	totalCards: number;
}

export function ChandelierMarkup({ totalCards }: ChandelierMarkupProps) {
	const armAngles = Array.from({ length: totalCards }, (_, index) => index * (360 / totalCards));

	return (
		<>
			<circle cx="0" cy="-252" r="4" fill="#D4B886" fillOpacity="0.6" />
			<ellipse
				cx="0"
				cy="-242"
				rx="14"
				ry="4"
				stroke="#D4B886"
				strokeWidth="0.7"
				strokeOpacity="0.4"
				fill="none"
			/>
			{[0, 60, 120, 180, 240, 300].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				return (
					<line
						key={degree}
						x1={0}
						y1={-252}
						x2={Math.sin(radian) * 14}
						y2={-242 + Math.cos(radian) * 4}
						stroke="#D4B886"
						strokeWidth="0.45"
						strokeOpacity="0.3"
					/>
				);
			})}

			<line x1="0" y1="-242" x2="0" y2="195" stroke="url(#shaft-fade)" strokeWidth="1" />

			<ellipse
				cx="0"
				cy="-130"
				rx="40"
				ry="9"
				stroke="#D4B886"
				strokeWidth="0.7"
				strokeOpacity="0.32"
				fill="none"
			/>
			{[0, 72, 144, 216, 288].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				return (
					<line
						key={degree}
						x1={0}
						y1={-130}
						x2={Math.sin(radian) * 40}
						y2={-130 + Math.cos(radian) * 9}
						stroke="#D4B886"
						strokeWidth="0.5"
						strokeOpacity="0.25"
					/>
				);
			})}
			{[0, 72, 144, 216, 288].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				const hangerX = Math.sin(radian) * 40;
				const hangerY = -130 + Math.cos(radian) * 9;
				return (
					<g key={degree}>
						<line
							x1={hangerX}
							y1={hangerY}
							x2={hangerX}
							y2={hangerY + 14}
							stroke="#D4B886"
							strokeWidth="0.4"
							strokeOpacity="0.25"
						/>
						<circle
							cx={hangerX}
							cy={hangerY + 16}
							r="1.8"
							fill="#D4B886"
							fillOpacity="0.32"
						/>
					</g>
				);
			})}

			<ellipse
				cx="0"
				cy="0"
				rx="20"
				ry="5.5"
				stroke="#D4B886"
				strokeWidth="1"
				strokeOpacity="0.55"
				fill="none"
			/>
			<ellipse
				cx="0"
				cy="-1.5"
				rx="12"
				ry="3.5"
				stroke="#D4B886"
				strokeWidth="0.55"
				strokeOpacity="0.3"
				fill="none"
			/>

			{armAngles.map((degree, index) => {
				const radian = (degree * Math.PI) / 180;
				const armLength = 58;
				const tipX = Math.sin(radian) * armLength;
				const tipY = Math.cos(radian) * 12;
				const opacity = 0.3 + Math.cos(radian) * 0.2;
				return (
					<g key={index}>
						<line
							x1={Math.sin(radian) * 12}
							y1={Math.cos(radian) * 3.5}
							x2={tipX}
							y2={tipY}
							stroke="#D4B886"
							strokeWidth="0.75"
							strokeOpacity={Math.max(0.12, opacity)}
						/>
						<line
							x1={tipX}
							y1={tipY}
							x2={tipX * 0.88}
							y2={tipY + 22}
							stroke="#D4B886"
							strokeWidth="0.45"
							strokeOpacity={Math.max(0.1, opacity - 0.05)}
						/>
						<circle
							cx={tipX * 0.88}
							cy={tipY + 25}
							r="2.2"
							fill="#D4B886"
							fillOpacity={Math.max(0.12, opacity + 0.05)}
						/>
						<circle
							cx={tipX * 0.88}
							cy={tipY + 30}
							r="1.3"
							fill="#D4B886"
							fillOpacity={Math.max(0.08, opacity - 0.05)}
						/>
					</g>
				);
			})}

			<circle cx="0" cy="0" r="18" fill="url(#orb-glow)" />
			<circle cx="0" cy="0" r="8" fill="#D4B886" fillOpacity="0.1" />
			<circle cx="0" cy="0" r="4.5" fill="#D4B886" fillOpacity="0.32" />
			<circle cx="0" cy="0" r="2" fill="#D4B886" fillOpacity="0.72" />
			{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree, index) => {
				const radian = (degree * Math.PI) / 180;
				const longRay = index % 2 === 0;
				return (
					<line
						key={degree}
						x1={Math.sin(radian) * 7}
						y1={-Math.cos(radian) * 7}
						x2={Math.sin(radian) * (longRay ? 19 : 13)}
						y2={-Math.cos(radian) * (longRay ? 19 : 13)}
						stroke="#D4B886"
						strokeWidth="0.45"
						strokeOpacity={longRay ? 0.32 : 0.18}
					/>
				);
			})}

			{[0, 72, 144, 216, 288].map((degree, chainIndex) => {
				const radian = (degree * Math.PI) / 180;
				const sourceX = Math.sin(radian) * 18;
				const sourceY = Math.cos(radian) * 4.5;

				return [16, 32, 48, 62, 73].map((distanceY, index) => {
					const fade = index / 4;
					return (
						<circle
							key={`${chainIndex}-${index}`}
							cx={sourceX * (1 - fade * 0.35)}
							cy={sourceY + distanceY}
							r={1.7 - index * 0.2}
							fill="#D4B886"
							fillOpacity={0.42 - index * 0.065}
						/>
					);
				});
			})}

			<ellipse
				cx="0"
				cy="78"
				rx="26"
				ry="6"
				stroke="#D4B886"
				strokeWidth="0.55"
				strokeOpacity="0.22"
				fill="none"
			/>
			{[0, 60, 120, 180, 240, 300].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				return (
					<line
						key={degree}
						x1={0}
						y1={78}
						x2={Math.sin(radian) * 26}
						y2={78 + Math.cos(radian) * 6}
						stroke="#D4B886"
						strokeWidth="0.4"
						strokeOpacity="0.18"
					/>
				);
			})}

			<line
				x1="0"
				y1="78"
				x2="0"
				y2="170"
				stroke="#D4B886"
				strokeWidth="0.75"
				strokeOpacity="0.28"
			/>
			<ellipse
				cx="0"
				cy="178"
				rx="4.5"
				ry="7"
				stroke="#D4B886"
				strokeWidth="0.7"
				strokeOpacity="0.35"
				fill="none"
			/>
			<ellipse cx="0" cy="180" rx="2" ry="3.5" fill="#D4B886" fillOpacity="0.22" />
		</>
	);
}
