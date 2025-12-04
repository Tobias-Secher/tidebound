'use client';

import { useEffect, useState } from "react";
import {useGetUser} from '@repo/services'

export const ClientComponent = () => {
    const [name, setName] = useState('Client');
    const {data} = useGetUser();

    useEffect(() => {
        fetch('https://api.github.com/users/tobias-secher')
            .then(res => res.json())
            .then(data => setName(`Client: ${data.name}`));
    }, []);

    return <div>
        <h1>OLD: {name}</h1>
        <h1>NEW: {(data as any)?.name}</h1>
        </div>;
}