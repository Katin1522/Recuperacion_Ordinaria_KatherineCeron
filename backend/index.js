import app from "./app.js";
import { config } from "./src/config.js";

async function main() {
    const PORT = config.server.PORT || 3000;
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}`);
        console.log('Using JSON file storage instead of MongoDB');
    });
}

main().catch(console.error);