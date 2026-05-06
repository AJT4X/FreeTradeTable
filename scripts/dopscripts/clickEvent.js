import { PicsSitesFunc, RightPicEdit } from './picSites.js';
import { sortFunc,DevComment,CreateFilter  } from './createTableMain.js';
import { FindDetect,CreateItemFindBlock } from './cetreContainer.js'
import { CreateGraph } from './createTableMain.js';

export function SetNewCur(newCur){
    localStorage.setItem('currency',newCur)
}
export function EventClick(callback) {
    let LeftPic = null;
    let returnJson = {};
    document.addEventListener('change',async (el)=>{
        
        sortFunc('MinMax');
    });
    document.addEventListener('click',async (el)=>{
        if(el.target.closest('#ProcentFiltered')){
            sortFunc('procent');
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