import { steam_icon_url,steam_items_all,jsob_sites_item_all,SitesInfo,CurAscii,ReversCurrency,SitesCurrency,SteamCurrency } from '../jsons/jsones_all.js';

export function PicsSitesFunc(editel){
    
    if(editel.target.id == 'leftPicSites'){
        
        editel.target.innerHTML = '';
        const LeftSelectDiv = document.createElement('div');
        const img = document.createElement('img');
        const TestSteam = document.createElement('span');
    
        img.src= steam_icon_url;
        
        TestSteam.innerText = 'Steam';
        TestSteam.style.fontSize = '24px';
        TestSteam.style.color = 'white';

        LeftSelectDiv.classList.add('LeftDiv');
        img.classList.add('imgSteamPic');

       
        LeftSelectDiv.append(img,TestSteam)
        editel.target.append(LeftSelectDiv);
        return 'steam';
    }

    const rightBlock = editel.target.closest('#rightPicSites');
    
    if(rightBlock){
        
        document.querySelector('#RightDiv')?.remove();
        const AllRightDiv = document.createElement('div');
        AllRightDiv.id = 'RightDiv';
        Object.entries(jsob_sites_item_all).forEach(([key,value])=>{
            const nameSite = key;
            Object.entries(value).forEach(([key,value])=>{
                const domain = key;
                const RowSitePic = document.createElement('div');
                const ImgPicSite = document.createElement('img');
                const TextPicSite = document.createElement('span');
                ImgPicSite.classList.add('imgSteamPic');
                RowSitePic.classList.add('RowSitePic');
                RowSitePic.dataset.name = nameSite;
                RowSitePic.dataset.domain = domain;
                ImgPicSite.src = SitesInfo[nameSite]['icon']
                TextPicSite.innerText = `${nameSite.toUpperCase()} ${domain.toUpperCase()}`;
                RowSitePic.append(ImgPicSite,TextPicSite);
                AllRightDiv.append(RowSitePic);
                
            });
            rightBlock.append(AllRightDiv);
        });
    }

}
export function RightPicEdit(site_name,domain){
    
    const el = document.querySelector('.right');
    if (el){
        el.innerHTML = `<div class="PicSites"><img class='imgSteamPic' src=${SitesInfo[site_name]['icon']}> <span>${site_name.toUpperCase()} (${domain.toUpperCase()})</span></div>`;
    }
}

export function ActiveGetStorage(name){
    
    return localStorage.getItem(name);
}