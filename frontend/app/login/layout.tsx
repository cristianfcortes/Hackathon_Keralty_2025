
export default function LoginLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
				{children}
			</div>
		</div>
	);
}
