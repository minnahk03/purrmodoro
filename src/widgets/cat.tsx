import { renderWidget, usePlugin } from '@remnote/plugin-sdk';
import { App } from '../App';
function CatWidget(){const plugin=usePlugin();return <App load={()=>plugin.storage.getLocal('purrmodoro-v1')} save={s=>plugin.storage.setLocal('purrmodoro-v1',s)}/>;}
renderWidget(CatWidget);
