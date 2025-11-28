'use client';

import { useEffect, useState } from "react";

export const ClientComponent = () => {
    const [name, setName] = useState('Client');

    useEffect(() => {
        fetch('https://api.github.com/users/tobias-secher')
            .then(res => res.json())
            .then(data => setName(`Client: ${data.name}`));
    }, []);

    return <div>{name}</div>;
}