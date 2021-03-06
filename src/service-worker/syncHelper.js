
import { deleteElementDb, readDb } from './indexDb';

const handleSync = async (event) => {

  if (event.tag === 'sync-new-message') {

    console.log('[Service Worker] Syncing Chat..');

    const batch = '329';
    const baseUrl = 'https://wagon-chat.herokuapp.com/';
    const requestUrl = `${baseUrl + batch}/messages`;
    const allData = await readDb('sync-chat');


    allData.forEach(async (data) => {

      try {

        console.log('Fetching', data);
        const responseChat = await fetch(requestUrl, {
          method: 'POST',
          body  : JSON.stringify(data.result)
        });

        if (responseChat.ok) {

          await deleteElementDb('sync-chat', data.id);

        }

      } catch (error) {

        console.log(error.message);

      }

    });

  }

};

export { handleSync };
