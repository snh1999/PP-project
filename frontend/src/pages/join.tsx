import React, { useState } from 'react';
import {makeRequest} from "@/pages/api/api";
import {actions} from "@/store";
import {useRouter} from "next/navigation";
import {Poll} from "@/pages/api/api.types";

export default function Join() {
    const [pollID, setPollID] = useState('');
    const [name, setName] = useState('');
    const [apiError, setApiError] = useState('');

    const router = useRouter();


    const areFieldsValid = (): boolean => {
        if (pollID.length < 6 || pollID.length > 6) {
            return false;
        }

        if (name.length < 1 || name.length > 25) {
            return false;
        }

        return true;
    };

    const handleJoinPoll = async () => {
        actions.startLoading();
        setApiError('');

        const { data, error } = await makeRequest<{
            poll: Poll;
            accessToken: string;
        }>('/polls/join', {
            method: 'POST',
            body: JSON.stringify({
                pollID,
                name,
            }),
        });

        console.log(data);

        if (error && error.statusCode === 400) {
            setApiError('Please make sure to include a poll topic!');
        } else if (error && !error.statusCode) {
            setApiError('Unknown API error');
        } else if(!data.poll){
            setApiError('Invalid Poll ID');
        } else {
            actions.initializePoll(data.poll);
            actions.setPollAccessToken(data.accessToken);
            router.push('/new-room');
        }

        actions.stopLoading();
    };

    return (
        <div className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-sm">
            <div className="mb-12">
                <div className="my-4">
                    <h3 className="text-center">
                        Enter Code Provided by &quot;Friend&quot;
                    </h3>
                    <div className="text-center w-full">
                        <input
                            maxLength={6}
                            onChange={(e) => setPollID(e.target.value.toUpperCase())}
                            className="box info w-full"
                            autoCapitalize="characters"
                            style={{ textTransform: 'uppercase' }}
                        />
                    </div>
                </div>
                <div className="my-4">
                    <h3 className="text-center">Your Name</h3>
                    <div className="text-center w-full">
                        <input
                            maxLength={25}
                            onChange={(e) => setName(e.target.value)}
                            className="box info w-full"
                        />
                    </div>
                </div>
                {apiError && (
                    <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
                )}
            </div>
            <div className="my-12 flex flex-col justify-center  items-center">
                <button
                    disabled={!areFieldsValid()}
                    className="box btn-orange dark:text-white w-32 my-2"
                    onClick={handleJoinPoll}
                >
                    Join
                </button>
                <button
                    className="box btn-purple dark:text-white w-32 my-2"
                    onClick={() => router.push('/')}
                >
                    Homepage
                </button>
            </div>
        </div>
    );
};

;