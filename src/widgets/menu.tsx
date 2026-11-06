import {renderWidget} from '@remnote/plugin-sdk';
import {usePet} from '../usePet';
import {Menu} from '../Menu';
function Widget(){const {s,send,error}=usePet();return s?<Menu s={s} send={send} error={error}/>:<div className="pet-menu">{error||'Waking your cat…'}</div>;}
renderWidget(Widget);
