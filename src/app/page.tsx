'use client'

import { useSession } from 'next-auth/react';

function Page() {
    const { data: session, status } = useSession(); // Corrected variable name for clarity
    const authStatus = status === "authenticated"
    if (status === "loading") {
        return <div className="w-full py-8 mt-4 text-center">Loading...</div>;
    }
    if (!authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <div className="flex flex-wrap">
                    <div className="p-2 w-full">
                        <h1 className="text-2xl font-bold hover:text-gray-500">
                            Login to Start
                        </h1>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <div className="flex flex-wrap">
                    <div className="p-2 w-full">
                        <h1 className="text-2xl font-bold hover:text-gray-500">
                            {`Welcome ${session.user.username}`}
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;
