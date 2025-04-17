import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (url: any) => {
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        // const socketClient: any = io(url);
        // setSocket(socketClient);

        // socketClient.on('connect', () => {
        //     console.log('Connected to server');
        // });

        // socketClient.on('disconnect', () => {
        //     console.log('Disconnected from server');
        // });

        // return () => {
        //     socketClient.disconnect();
        // };
    }, [url]);

    return socket;
};

export default useSocket;
