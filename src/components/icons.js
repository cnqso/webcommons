/** @format */
import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import "./icons.css";

export function AboutIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M12,24A12,12,0,1,1,24,12,12.013,12.013,0,0,1,12,24ZM12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Z' />
			<path d='M14,19H12V12H10V10h2a2,2,0,0,1,2,2Z' />
			<circle cx='12' cy='6.5' r='1.5' />
		</SvgIcon>
	);
}
export function BulldozeIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M21.99,16.72V8h-2v3.99h-3a3,3,0,0,0-2.316-2.921l-2.819-6.3A3,3,0,0,0,9.117.99H5V6H4A3,3,0,0,0,1,9l.01,5.99A5.032,5.032,0,0,0,5,23h8a5.031,5.031,0,0,0,4-8l0-1.013H19.99v2.73A8.838,8.838,0,0,0,22.6,23.01L24.01,21.6A6.853,6.853,0,0,1,21.99,16.72ZM7,2.99H9.117a1,1,0,0,1,.912.592L12.448,8.99H7ZM4,8H5V9.99l.01,1h8.98a1,1,0,0,1,1,1l0,1.423A4.975,4.975,0,0,0,13,13H5a4.965,4.965,0,0,0-1.993.415L3,9A1,1,0,0,1,4,8Zm9,13H5a3,3,0,0,1,0-6h8A3,3,0,0,1,13,21ZM6,18a1,1,0,0,1-2,0A1,1,0,0,1,6,18Zm8,0a1,1,0,0,1-2,0A1,1,0,0,1,14,18Zm-4,0a1,1,0,0,1-2,0A1,1,0,0,1,10,18Z' />
		</SvgIcon>
	);
}
export function CityIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M11,15h-2v-2h2v2Zm4-2h-2v2h2v-2Zm-4,4h-2v2h2v-2Zm4,0h-2v2h2v-2ZM11,5h-2v2h2v-2Zm4,0h-2v2h2v-2Zm-4,4h-2v2h2v-2Zm4,0h-2v2h2v-2Zm9-1c0-1.654-1.346-3-3-3h-2V3c0-1.654-1.346-3-3-3H8c-1.654,0-3,1.346-3,3v6H3c-1.654,0-3,1.346-3,3v12H24V8ZM2,12c0-.552,.449-1,1-1H7V3c0-.552,.449-1,1-1h8c.551,0,1,.448,1,1V7h4c.551,0,1,.448,1,1v14H2V12Zm18,1h-2v2h2v-2Zm0,4h-2v2h2v-2ZM6,13h-2v2h2v-2Zm0,4h-2v2h2v-2Zm14-8h-2v2h2v-2Z' />
		</SvgIcon>
	);
}
export function CommercialIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M24,8L21.754,0H2.246L0,8c0,1.012,.378,1.937,1,2.643v10.357c0,1.654,1.346,3,3,3H12c1.654,0,3-1.346,3-3V11.463c.376-.218,.714-.496,1-.82,.733,.832,1.806,1.357,3,1.357h1c.345,0,.68-.044,1-.127v12.127h2V10.643c.622-.705,1-1.631,1-2.643Zm-12,14H4c-.551,0-1-.449-1-1v-3H13v3c0,.551-.449,1-1,1Zm1-6H3v-4.127c.32,.083,.655,.127,1,.127h1c1.194,0,2.266-.526,3-1.357,.734,.832,1.806,1.357,3,1.357h2v4Zm6-6c-1.103,0-2-.897-2-2h-2c0,1.103-.897,2-2,2h-2c-1.103,0-2-.897-2-2h-2c0,1.103-.897,2-2,2h-1c-1.061,0-1.931-.83-1.996-1.874L3.754,2h3.246v3h2V2h6v3h2V2h3.246l1.75,6.126c-.065,1.044-.936,1.874-1.996,1.874h-1Z' />
		</SvgIcon>
	);
}
export function IndustrialIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M21,24H3c-1.654,0-3-1.346-3-3V0H5.807l2.305,10.631,5.889-4.712v4.167l5-4.247v4.263l5-4.271v15.169c0,1.654-1.346,3-3,3ZM2,2V21c0,.552,.448,1,1,1H21c.552,0,1-.448,1-1V10.169l-3.313,2.831h-1.687v-2.839l-3.342,2.839h-1.658v-2.919l-3.649,2.919h-1.772L4.193,2H2Zm8,14h-3v3h3v-3Zm5,0h-3v3h3v-3Zm5,0h-3v3h3v-3Z' />
		</SvgIcon>
	);
}
export function LogOutIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M2,21V3A1,1,0,0,1,3,2H8V0H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H8V22H3A1,1,0,0,1,2,21Z' />
			<path d='M23.123,9.879,18.537,5.293,17.123,6.707l4.264,4.264L5,11l0,2,16.443-.029-4.322,4.322,1.414,1.414,4.586-4.586A3,3,0,0,0,23.123,9.879Z' />
		</SvgIcon>
	);
}
export function NuclearIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='m22.563 1.437c-2.374-2.374-5.919-1.795-10.563 1.7-4.643-3.495-8.187-4.075-10.563-1.7s-1.795 5.919 1.7 10.563c-3.495 4.643-4.075 8.188-1.7 10.563a4.7 4.7 0 0 0 3.442 1.437c1.971 0 4.351-1.052 7.121-3.136 2.769 2.084 5.149 3.136 7.121 3.136a4.7 4.7 0 0 0 3.442-1.437c2.375-2.375 1.8-5.919-1.7-10.563 3.495-4.644 4.075-8.188 1.7-10.563zm-3.478.591a2.806 2.806 0 0 1 2.067.819c1.746 1.747.456 4.713-1.588 7.539-.838-.988-1.782-2.015-2.858-3.092s-2.106-2.021-3.094-2.86c1.898-1.373 3.86-2.406 5.473-2.406zm-.774 9.972c-1.011 1.22-2.082 2.361-3.016 3.3s-2.075 2-3.295 3.011c-1.22-1.011-2.361-2.082-3.295-3.011s-2.005-2.08-3.016-3.3c1.011-1.22 2.082-2.362 3.016-3.295s2.075-2.005 3.295-3.017c1.22 1.01 2.361 2.083 3.3 3.017s2 2.075 3.011 3.295zm-15.463-9.152a2.8 2.8 0 0 1 2.067-.82c1.613 0 3.575 1.033 5.473 2.406-.988.839-2.016 1.783-3.094 2.86s-2.02 2.1-2.859 3.092c-2.043-2.826-3.335-5.792-1.587-7.538zm0 18.3c-1.746-1.746-.456-4.713 1.587-7.538.839.988 1.783 2.015 2.859 3.092s2.1 2.023 3.089 2.861c-2.825 2.046-5.791 3.337-7.535 1.589zm18.3 0c-1.745 1.744-4.71.457-7.535-1.585.986-.838 2.014-1.787 3.089-2.861s2.02-2.1 2.858-3.092c2.048 2.83 3.34 5.796 1.592 7.542z' />
			<circle cx='12' cy='12' r='2' />
		</SvgIcon>
	);
}
export function PoleIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M12.566,24H8.719l2-8H6.586a2.561,2.561,0,0,1-2.451-3.3L7.976,0h9.467l-3,8h4.023a2.533,2.533,0,0,1,2.11,3.932Zm-1.285-2h.212l7.416-11.174A.532.532,0,0,0,18.466,10H11.557l3-8H9.46L6.049,13.276A.561.561,0,0,0,6.586,14h6.7Z' />
		</SvgIcon>
	);
}
export function QuestionIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M12,24A12,12,0,1,1,24,12,12.013,12.013,0,0,1,12,24ZM12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Z' />
			<path d='M13,15H11v-.743a3.954,3.954,0,0,1,1.964-3.5,2,2,0,0,0,1-2.125,2.024,2.024,0,0,0-1.6-1.595A2,2,0,0,0,10,9H8a4,4,0,1,1,5.93,3.505A1.982,1.982,0,0,0,13,14.257Z' />
			<rect x='11' y='17' width='2' height='2' />
		</SvgIcon>
	);
}
export function ResidentialIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M22.849,7.68l-.869-.68h.021V2h-2v3.451L13.849,.637c-1.088-.852-2.609-.852-3.697,0L1.151,7.68c-.731,.572-1.151,1.434-1.151,2.363v13.957H9V15c0-.551,.448-1,1-1h4c.552,0,1,.449,1,1v9h9V10.043c0-.929-.42-1.791-1.151-2.363Zm-.849,14.32h-5v-7c0-1.654-1.346-3-3-3h-4c-1.654,0-3,1.346-3,3v7H2V10.043c0-.31,.14-.597,.384-.788L11.384,2.212c.363-.284,.869-.284,1.232,0l9,7.043c.244,.191,.384,.478,.384,.788v11.957Z' />
		</SvgIcon>
	);
}
export function RoadIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M17.321,0H6.681A2.994,2.994,0,0,0,3.726,2.483L-.039,24h24.1L20.276,2.48A3,3,0,0,0,17.321,0ZM2.341,22,5.7,2.828A1,1,0,0,1,6.681,2h10.64a1,1,0,0,1,.985.827L21.679,22ZM11,4h2V8H11Zm0,6h2v4H11Zm0,6h2v4H11Z' />
		</SvgIcon>
	);
}
export function SunMoonIcon({ ic }) {
	return (
		<SvgIcon className={ic}>
			<path d='M24,13V11H19.931a7.957,7.957,0,0,0-.569-2.129l3.52-2.049L21.876,5.094l-3.53,2.054a8.092,8.092,0,0,0-1.5-1.5l2.048-3.52L17.162,1.121,15.119,4.634A7.956,7.956,0,0,0,13,4.069V0H11V4.069a7.94,7.94,0,0,0-2.106.559L6.854,1.121,5.126,2.127,7.169,5.639a8.02,8.02,0,0,0-1.51,1.5L2.14,5.094,1.134,6.822,4.642,8.864A7.928,7.928,0,0,0,4.069,11H0v2H4.069a7.985,7.985,0,0,0,.569,2.129l-3.5,2.036,1,1.729,3.508-2.042a8.045,8.045,0,0,0,1.492,1.492L5.1,21.865l1.728,1.006L8.868,19.36A7.934,7.934,0,0,0,11,19.931V24h2V19.931a7.944,7.944,0,0,0,2.144-.577l2.045,3.517,1.729-1.006-2.053-3.529a8.038,8.038,0,0,0,1.486-1.491l3.518,2.049,1.006-1.729-3.51-2.044A7.961,7.961,0,0,0,19.931,13ZM12,18a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,18Zm2.252-2.7A4,4,0,1,1,13.929,8.5,3.926,3.926,0,0,0,12,11.818,4.361,4.361,0,0,0,14.252,15.3Z' />
		</SvgIcon>
	);
}

export function GithubIcon({ ic }) {
	return (
		<a href='https://github.com/cnqso/webcommons' target='_blank' rel='noreferrer' className={ic}>
			<SvgIcon>
				<path d='M12,0.296c-6.627,0-12,5.372-12,12c0,5.302,3.438,9.8,8.206,11.387   c0.6,0.111,0.82-0.26,0.82-0.577c0-0.286-0.011-1.231-0.016-2.234c-3.338,0.726-4.043-1.416-4.043-1.416   C4.421,18.069,3.635,17.7,3.635,17.7c-1.089-0.745,0.082-0.729,0.082-0.729c1.205,0.085,1.839,1.237,1.839,1.237   c1.07,1.834,2.807,1.304,3.492,0.997C9.156,18.429,9.467,17.9,9.81,17.6c-2.665-0.303-5.467-1.332-5.467-5.93   c0-1.31,0.469-2.381,1.237-3.221C5.455,8.146,5.044,6.926,5.696,5.273c0,0,1.008-0.322,3.301,1.23   C9.954,6.237,10.98,6.104,12,6.099c1.02,0.005,2.047,0.138,3.006,0.404c2.29-1.553,3.297-1.23,3.297-1.23   c0.653,1.653,0.242,2.873,0.118,3.176c0.769,0.84,1.235,1.911,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921   c0.43,0.372,0.814,1.103,0.814,2.222c0,1.606-0.014,2.898-0.014,3.293c0,0.319,0.216,0.694,0.824,0.576   c4.766-1.589,8.2-6.085,8.2-11.385C24,5.669,18.627,0.296,12,0.296z' />
				<path d='M4.545,17.526c-0.026,0.06-0.12,0.078-0.206,0.037c-0.087-0.039-0.136-0.121-0.108-0.18   c0.026-0.061,0.12-0.078,0.207-0.037C4.525,17.384,4.575,17.466,4.545,17.526L4.545,17.526z' />
				<path d='M5.031,18.068c-0.057,0.053-0.169,0.028-0.245-0.055c-0.079-0.084-0.093-0.196-0.035-0.249   c0.059-0.053,0.167-0.028,0.246,0.056C5.076,17.903,5.091,18.014,5.031,18.068L5.031,18.068z' />
				<path d='M5.504,18.759c-0.074,0.051-0.194,0.003-0.268-0.103c-0.074-0.107-0.074-0.235,0.002-0.286   c0.074-0.051,0.193-0.005,0.268,0.101C5.579,18.579,5.579,18.707,5.504,18.759L5.504,18.759z' />
				<path d='M6.152,19.427c-0.066,0.073-0.206,0.053-0.308-0.046c-0.105-0.097-0.134-0.234-0.068-0.307   c0.067-0.073,0.208-0.052,0.311,0.046C6.191,19.217,6.222,19.355,6.152,19.427L6.152,19.427z' />
				<path d='M7.047,19.814c-0.029,0.094-0.164,0.137-0.3,0.097C6.611,19.87,6.522,19.76,6.55,19.665   c0.028-0.095,0.164-0.139,0.301-0.096C6.986,19.609,7.075,19.719,7.047,19.814L7.047,19.814z' />
				<path d='M8.029,19.886c0.003,0.099-0.112,0.181-0.255,0.183c-0.143,0.003-0.26-0.077-0.261-0.174c0-0.1,0.113-0.181,0.256-0.184   C7.912,19.708,8.029,19.788,8.029,19.886L8.029,19.886z' />
				<path d='M8.943,19.731c0.017,0.096-0.082,0.196-0.224,0.222c-0.139,0.026-0.268-0.034-0.286-0.13   c-0.017-0.099,0.084-0.198,0.223-0.224C8.797,19.574,8.925,19.632,8.943,19.731L8.943,19.731z' />
			</SvgIcon>
		</a>
	);
}

export function WebsiteIcon({ ic }) {
	return (
		<a href='https://cnqso.github.io/' target='_blank' rel='noreferrer' className={ic}>
			<SvgIcon>
				<path d='M21,2H3C1.35,2,0,3.35,0,5V22H24V5c0-1.65-1.35-3-3-3ZM3,4H21c.55,0,1,.45,1,1v2H2v-2c0-.55,.45-1,1-1Zm-1,16V9H22v11H2Zm2-9h6v2h-2v5h-2v-5h-2v-2Zm8,0h7v2h-7v-2Zm0,4h7v2h-7v-2Z' />
			</SvgIcon>
		</a>
	);
}