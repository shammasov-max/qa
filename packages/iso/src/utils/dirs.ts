import * as Path from "path";
import { mkdirp } from "mkdirp";

const REPO_ROOT_DIR = Path.join(__dirname, "..", "..", "..");
const BUILD_FRONT_DIR = Path.join(REPO_ROOT_DIR, 'packages','front','dist')


const UPLOADS_DIR = Path.join(REPO_ROOT_DIR, 'deploy','.uploads')
try {
    mkdirp.sync (UPLOADS_DIR)
    mkdirp.sync (Path.join (UPLOADS_DIR, 'tracks'))

    mkdirp.sync (Path.join (UPLOADS_DIR, 'images'))
}catch(e){
    console.error(e)
}

export {
    REPO_ROOT_DIR,
    BUILD_FRONT_DIR,
    UPLOADS_DIR
}
