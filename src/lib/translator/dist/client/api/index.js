export const createClient = ({ api, serverURL })=>{
    const translate = async (args)=>{
        try {
            const response = await fetch(`${serverURL}${api}/translator/translate`, {
                body: JSON.stringify(args),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            if (!response.ok) return {
                success: false
            };
            return response.json();
        } catch (e) {
            if (e instanceof Error) console.error(e.message);
            return {
                success: false
            };
        }
    };
    return {
        translate
    };
};

//# sourceMappingURL=index.js.map