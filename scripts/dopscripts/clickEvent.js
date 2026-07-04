import { PicsSitesFunc, RightPicEdit } from './picSites.js';
import { sortFunc,DevComment,CreateFilter,overPayCreate  } from './createTableMain.js';
import { FindDetect,CreateItemFindBlock,FindTf2Key } from './cetreContainer.js'
import { CreateGraph } from './createTableMain.js';
import { CreateMainInfoBlockItem } from './ItemInfoWatchMenu.js'

export function SetNewCur(newCur){
    localStorage.setItem('currency',newCur)
}
export function SetNewLanguage(newLG){
    localStorage.setItem('language_user',newLG)
}
export function EventClick(callback) {
    let LeftPic = null;
    let returnJson = {};
    document.addEventListener('change',async (el)=>{
        
        sortFunc('MinMax');
    });
    document.addEventListener('click',async (el)=>{
        if (el.target.closest('#SteamIcon')){
            const icon = el.target.closest('#SteamIcon');
            if (!icon) return;
            const row = icon.closest('.MainDiv');
            if(!row) return;
            const skinName = row.querySelector('[data-skinname]')?.dataset.skinname;
            if(!skinName) return;
          
            const gameId = row.querySelector('[data-gameid]')?.dataset.gameid;
           
            const steamMarketUrl =
        `https://steamcommunity.com/market/listings/${gameId}/${encodeURIComponent(skinName)}`;
        window.open(steamMarketUrl, '_blank');
        return;
            
        }
        if (el.target.closest('#ExitButtonItemInfo')){
            document.querySelector('#MainBlockDivItemShowInfo')?.remove();
        }
        if (el.target.closest('#watch')){
            CreateMainInfoBlockItem(el);
        };
        if(el.target.closest('#overpay')){
            overPayCreate(el);
        };
        if(el.target.closest('#ProcentFiltered')){
            sortFunc('procent');
        };
        if(el.target.closest('#FindTf2Key')){
            FindTf2Key();
        };
        if(el.target.closest('#PriceFiltered')){
            sortFunc('price');
        };
        if(el.target.closest('#SortItemInTable')){
            CreateFilter();
        };
        if(el.target.closest('#CommentDev')){
            DevComment();
        };
        if(el.target.closest('#ItemInRow')){
            navigator.clipboard.writeText(el.target.dataset.name);
        };
        if(el.target.closest('#FindDetect')){
            FindDetect();
        };
        if(el.target.closest('#btnfinditem')){
            CreateItemFindBlock();
        }
        if(el.target.closest('#GraphFind')){
            CreateGraph(el);
        }

        const classCheckRL = el.target.closest('#rightPicSites') || el.target.closest('#leftPicSites');
        
        
        if (classCheckRL){
            if(PicsSitesFunc(el) == 'steam'){
                LeftPic = 'steam';
            };
        };
        const checkRowRight = el.target.closest('.RowSitePic');
        if (!checkRowRight) return;
        
        if(checkRowRight){
            returnJson = {
                leftSite: LeftPic,
                site_name: checkRowRight.dataset.name,
                domain: checkRowRight.dataset.domain
            };
            if(LeftPic){
               
                RightPicEdit(checkRowRight.dataset.name,checkRowRight.dataset.domain);
                callback(returnJson);
            }
        }
    });
}