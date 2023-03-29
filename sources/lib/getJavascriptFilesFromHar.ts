import { Entry, Har, IInitiator } from './har/interfaces';
import { JavascriptFile } from './files/JavascriptFile';


const getJavascriptFilesFromHar = (har: Har): JavascriptFile[] => {
    const javascriptFiles = har.log.entries.filter(
        (item: Entry): boolean => {
            if (!item.response.content.text) {
                console.error(`Пустой ответ на ${ item.request.url }`);

                return false;
            }

            return item.response.content.mimeType === 'application/javascript';
        }
    ).map((item: Entry): JavascriptFile => {

        // const search = 'EOReqCommons/trash/Services/ExpiryCountdownController/Facade';

        let content = item.response.content.text as string;
        const { encoding } = item.response.content;

        // undefined именно строкой
        if (encoding && encoding !== 'undefined') {
            if (encoding === 'base64') {
                content = decodeURIComponent(atob(content));
            } else {
                console.error(
                    `ERROR: Неизвестное кодирование: ${ encoding }`
                );
            }
        }

        const file = new JavascriptFile({
            initiator: item._initiator as unknown as IInitiator,
            url: item.request.url
                ?.replace(/^https?:\/\/.*?\//, '')
                // ?.replace(/https:\/\/.*\/static\/resources\//, '')
                ?.replace(/^static\/resources\//, '')
                ?.replace(/\?.*$/, ''),
            content,
            size: item.response.content.size,
        });

        // if (item.response.content.text?.includes(search)) {
        //     console.log('!!!!!!!');
        //     console.log('!!!!!!!');
        //     console.log(file);
        //     console.log('!!!!!!!');
        //     console.log('!!!!!!!');
        // }

        return file;
    });

    return javascriptFiles;
};


export {
    getJavascriptFilesFromHar,
};
