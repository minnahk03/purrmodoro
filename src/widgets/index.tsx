import {declareIndexPlugin,ReactRNPlugin} from '@remnote/plugin-sdk';
import {activate} from '../controller';
let cleanup:(()=>Promise<void>)|undefined;
declareIndexPlugin(async(plugin:ReactRNPlugin)=>{cleanup=await activate(plugin);},async()=>{await cleanup?.();cleanup=undefined;});
