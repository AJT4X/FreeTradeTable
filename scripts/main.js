// import { SteamIcon,SteamItemJson,SitesItemAll,SitesInfoAll,CurAscii,ReversCurrency,SitesCurrency,SteamCurrency } from './jsons/jsones_all.js';
import { EventClick } from './dopscripts/clickEvent.js';
import { CreateMainTable  } from './dopscripts/createTableMain.js';
import { CenterDiv } from './dopscripts/cetreContainer.js';

document.addEventListener('DOMContentLoaded',()=>{
    start();
});

function start(){
    const MainDiv = document.createElement('div');

    const HeadDiv = document.createElement('div');
    const leftPicSteam = document.createElement('div');
    const rightPicSites = document.createElement('div');

    const centreBlockDiv = document.createElement('div');
    
    HeadDiv.classList.add('headMainDiv');
    rightPicSites.classList.add('right','dropdown');
    leftPicSteam.classList.add('left','dropdownLeft');
    centreBlockDiv.classList.add('centre');

    leftPicSteam.id ='leftPicSites';
    rightPicSites.id = 'rightPicSites';

    leftPicSteam.innerText = 'Click...';
    rightPicSites.innerText = 'Click...';
    CenterDiv(centreBlockDiv);

    HeadDiv.append(leftPicSteam,centreBlockDiv,rightPicSites);
    document.body.appendChild(HeadDiv);
    EventClick((data)=>{
        
        new CreateMainTable(data).createMainTB();

    });
    
    
}