import { steam_icon_url,steam_items_all,jsob_sites_item_all,SitesInfo,CurAscii,ReversCurrency,SitesCurrency,SteamCurrency} from '../jsons/jsones_all.js';
import { TranslationBlock } from '../jsons/translate.js';
import { calculateTimestamsShort } from './background.js';
import { ActiveGetStorage } from './picSites.js';
import { historySitesAll } from '../jsons/history.js';


export class CreateMainTable{

    constructor(data){
        this.leftSite = data.leftSite;
        this.rightSite = data.site_name;
        this.domain = data.domain;
        this.limit = 100;
        this.offset = 0;
        this.allItemsForRender = [];
        this.isLoading = false; 
        this.hasMore = true;
        this. SteamPolar = localStorage.getItem('SteamPolar') || "Offer";
        this.newPolar = this.SteamPolar === 'Offer'? "offer" : "order";
        this.container = null;
        this.mainTableDiv = null;
    }
    createMainTB(){
        
            let langUser = localStorage.getItem('language_user') || "EN";
            document.querySelector('#mainTableDiv_Edit')?.remove();
            document.querySelector("#GrandItemDivFind")?.remove();
            const MainCurrency = ActiveGetStorage('currency');
            
            this.mainTableDiv = document.createElement('div');
            const headHelpDiv = document.createElement('div');
            
            this.mainTableDiv.id = 'mainTableDiv_Edit';
            this.mainTableDiv.classList.add('mainTableDiv');
            this.container = document.createElement('div');
            this.container.classList.add('RowContanerDiv');


            
            headHelpDiv.classList.add('headHelpDiv');
            
            headHelpDiv.innerHTML = `
                <span class='RowInfo' id='SiteName' data-domain='${this.domain}' data-sitename='${this.rightSite}'>${this.rightSite} ${TranslationBlock[langUser]['domain'][this.domain]}</span>
                <span class='RowInfo'>Update:${(SitesInfo[this.rightSite]['timeupdate'][this.domain]).slice(0,16)}</span>
                ${SitesInfo[this.rightSite]?.promo 
                ?`<span class='RowInfo'>Promo: ${SitesInfo[this.rightSite].promo}</span>` : ''}
                <button title='Сортировка' class='Sort' id="SortItemInTable">↓☰↑</button>
                <a class='RowInfo' style='color:red;font-size:14px' href="${SitesInfo[this.rightSite]['url']}" target="_blank">${TranslationBlock[langUser]['GoSite']}</a>
                ${SitesInfo[this.rightSite]?.comment
                    ?`<span title='site info' id='CommentDev' style='cursor:pointer;color:red' class="RowInfo">⚠️</span>` : ''}
        `;
            this.mainTableDiv.append(headHelpDiv, this.container);
            document.body.append(this.mainTableDiv);

            
            this.loadMoreItems(MainCurrency);
            this.container.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

    };


    async loadMoreItems(MainCurrency){
        
        if(this.isLoading || !this.hasMore) return;

        this.isLoading = true;

        try{
            const allRightBlock = jsob_sites_item_all[this.rightSite][this.domain];
            const gameListUser = localStorage.getItem("usergameset");
            //'name':{'info':int'price'} = *entries = [['name':...]]
            //filter true/false если отвечает условию
            const entries = Object.entries(allRightBlock)
            .filter(([key]) =>{
                const item = steam_items_all[key];
                return item && gameListUser.includes(item.item_game_type);
            })
            .sort((a,b)=>b[1].price-a[1].price);
            
            const sliseBlock = entries.slice(this.offset, this.offset + this.limit);

            if(sliseBlock.length==0){
                this.hasMore = false;
                return;
            }

            const fragment = document.createDocumentFragment();

            for (const [key,value] of sliseBlock){
                const element = this.rendeItem(key,value,MainCurrency);
                if(element){
                    fragment.appendChild(element);
                }
            }

            this.container.appendChild(fragment);
            this.offset += this.limit;
        }catch(err){
            console.log(err)
        }finally {
            this.isLoading = false;
        }
    };

    async handleScroll(){
        if(this.isLoading || !this.hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = this.container;

        if (scrollTop + clientHeight >= scrollHeight - 300) {
            this.loadMoreItems(ActiveGetStorage('currency'));
        }
    }
    rendeItem(key,value,MainCurrency){
        try{
            
            if(value['active'] == 'true'){
                let RightItem = jsob_sites_item_all[this.rightSite][this.domain][key];
                let gameListUser = localStorage.getItem("usergameset");
                let LeftItem = steam_items_all[key];
                
                const GameIndex = {
                    "cs2" : "730",
                    "tf2" : "440",
                    "rust" : "252490"
                }
                const game_type = LeftItem.item_game_type;
                
                
                const RowDivItemInfo = document.createElement('div');
                RowDivItemInfo.classList.add('rowDiv');
                if(RightItem['overpay']){
                    RowDivItemInfo.style.border = '1px solid purple';
                }
                let steam_price_check = LeftItem ? parseFloat(LeftItem['price']) : 0;
               
                if(steam_price_check == 0){
                    return;
                }
                
                let SteamCur = CurAscii[LeftItem['currency']];
                let steam_price = steam_price_check / (SteamCurrency[SteamCur]);
                let steam_dollar_price = parseFloat(LeftItem['dollarPrice'][this.newPolar]);
                
                let Procent = parseFloat((parseFloat(RightItem.price - parseFloat(steam_dollar_price))/parseFloat(steam_dollar_price))*100).toFixed(2);    
                
                RowDivItemInfo.innerHTML = `

                <div class='MainDiv'>
                    <div class="RowDivItem">
                        <img class='imgSteamPic itemInRow' data-domain='${this.domain}' data-skinname="${key}" src=${LeftItem.image? LeftItem.image : 'https://community.fastly.steamstatic.com/economy/image/'+RightItem.icon}></img>
                        <span style="color:white;font-size: 24px;cursor: pointer" data-gameid="${game_type}" id='ItemInRow' data-name="${key}">${key} </span>
                    </div>
                    <div class='RowDivItem' >
                        <img class="imgSteamPic itemInRow" id='SteamIcon' src="${steam_icon_url}">
                        <span class="smalRowInfo ${this.newPolar ==='order' ? 'order_blue' : ''}" id='ItemInRowSteam'data-dollarprice='${parseFloat(LeftItem['dollarPrice'][this.newPolar])}' data-price='${(parseFloat(steam_dollar_price)*parseFloat(SteamCurrency[MainCurrency]))}'>${(parseFloat(steam_dollar_price)*parseFloat(SteamCurrency[MainCurrency])).toFixed(2)}${ReversCurrency[MainCurrency]}</span>
                        <span class="smalRowInfo" id="time">(${calculateTimestamsShort(LeftItem.timestamp)})</span>
                        <img class='imgSteamPic itemInRow' src='${SitesInfo[this.rightSite].icon}'>
                        <span class='smalRowInfo' id='ItemInRow'data-dollarprice='${RightItem.price}' data-price='${RightItem.price}'>${((RightItem.price)*parseFloat(SitesCurrency[MainCurrency])).toFixed(2)}${ReversCurrency[MainCurrency]}</span>
                        <span id='Procent' data-procent=${Procent} style='color:${Procent>0? 'green' : 'red'}'>${Procent > 0? '+' : ''}${Procent}%</span>
                    <span id='watch'>👁️</span>
                    </div>
                </div>
                
                `
                ;
                if (RowDivItemInfo){
                    return RowDivItemInfo
                }
               

            }
        }catch(err){
            console.log(err,key);
        }
        }
};

export function CreateFilter(){
    document.querySelector('#SortItemInTable')?.remove();
    document.querySelector('#FilteredDiv')?.remove();
    const helpDiv = document.querySelector('.headHelpDiv');
    const FilteredDiv = document.createElement('div');
    FilteredDiv.classList.add('RowInfo');
    FilteredDiv.id = 'FilteredDiv';

    FilteredDiv.innerHTML = `
    <span id='ProcentFiltered' class='Sort'>↕%</span>
    <span id='PriceFiltered' class='Sort'>↕$</span>
    
    <div id='MinMax'>
        <input class='MinMaxInput' id='minPrice' placeholder='Min.Price'></input>
        <input class='MinMaxInput' id='maxPrice' placeholder='Max.Price'></input>
    </div>
    
    `;
    
    helpDiv.append(FilteredDiv);
    return;
}
let StatusFilterMain = 'asc';
let StatusFilterPrice = 'asc';

export function sortFunc(info){
   
    if (info=='procent'){
        
        let cont = document.querySelector('.RowContanerDiv');
        const allRow = Array.from(cont.querySelectorAll('.rowDiv'));
        allRow.sort((a,b)=>{
            let A = Number(a.querySelector('[data-procent]').dataset.procent);
            let B = Number(b.querySelector('[data-procent]').dataset.procent);
           
            return StatusFilterMain ==='asc' ? A-B : B-A;
        });
        allRow.forEach(el=>cont.appendChild(el));
        StatusFilterMain = StatusFilterMain ==='asc' ? "desc" : "asc";
    }else if(info=='price'){
        
        let cont = document.querySelector('.RowContanerDiv');
        const allRow = Array.from(cont.querySelectorAll('.rowDiv'));
        allRow.sort((a,b)=>{
            let A = Number(parseFloat(a.querySelector('[data-dollarprice]').dataset.dollarprice));
            let B = Number(parseFloat(b.querySelector('[data-dollarprice]').dataset.dollarprice));
           
            return StatusFilterPrice ==='asc' ? A-B : B-A;
        });
        allRow.forEach(el=>cont.appendChild(el));
        StatusFilterPrice = StatusFilterPrice ==='asc' ? "desc" : "asc";
    }else if(info=='MinMax'){
        
        let min = Number(document.getElementById('minPrice').value) || 0;
        let max = Number(document.getElementById('maxPrice').value) || Infinity;

        let cont = document.querySelector('.RowContanerDiv');
        const allRow = Array.from(cont.querySelectorAll('.rowDiv'));

        allRow.forEach(row=>{
            let price = Number(row.querySelector('[data-price]').dataset.price);
            if (price>= min && price <= max){
                row.style.display = '';
            }else{
                row.style.display='none';
            }
        });
    }
}

export function DevComment(){
    
    if (document.querySelector('#Comment')){
        document.querySelector('#Comment')?.remove();
        return;
    }
    const uzerLanguage = localStorage.getItem('language_user') || 'EN';
    const Comment = document.createElement('div');
    const headDiv = document.querySelector('.headHelpDiv');
    const site_name_find = headDiv.querySelector('#SiteName');
    const site_name = site_name_find.dataset.sitename;
    Comment.id = 'Comment';
    Comment.innerHTML = `<span class='RowInfo'>${SitesInfo[site_name]['comment'][uzerLanguage]}</span>`;
    headDiv.append(Comment);
    return;
}

export function CreateGraph(e) {
    try{
        let currency = localStorage.getItem('currency') || "USD";
        let SteamCur = parseFloat(SteamCurrency[currency]);
        let SiteCur = parseFloat(SitesCurrency[currency]);
        let ReversCurrencyText = ReversCurrency[currency];
        

        const historyDiv = document.querySelector('#History');
        
        
        const MainSite = document.querySelector('#SiteName')?.dataset['sitename'];
        const DomainMain = document.querySelector('#SiteName')?.dataset['domain'];
        
        const result = [];
        const itemName = e;
        
        
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';
        const canvas = document.createElement('canvas');
        canvas.id = 'CanvasActive';

        chartWrapper.append(canvas);
        historyDiv.append(chartWrapper);
        let itemData = null;
        
        // собираем данные
        
        
        const SteamData =  historySitesAll['steam']['main'][itemName];
        
        

        
        const datasetsMap = {};
        if(MainSite !== 'steam'){
            itemData = historySitesAll[MainSite][DomainMain][itemName];
            itemData.forEach(item => {
            const key = `${MainSite} (${DomainMain})`;
            if (!datasetsMap[key]) {
                datasetsMap[key] = [];
            }

            datasetsMap[key].push({
                x: new Date(item.time * 1000),
                y: item.price*SiteCur,
                BotCanBuy: item.maxBotGetItem ?? null,
                OnBot: item.OnBot ?? null,
            });
        });

        }
            
        
        
        SteamData.forEach(item => {
            const key = `Steam`;
            if (!datasetsMap[key]) {
                datasetsMap[key] = [];
            }

            datasetsMap[key].push({
                x: new Date(item.time * 1000),
                y: item.price*SteamCur,
                
            });
        });
        SteamData.forEach(item => {
            const key = `Steam (Order)`;
            if (!datasetsMap[key]) {
                datasetsMap[key] = [];
            }

            datasetsMap[key].push({
                x: new Date(item.time * 1000),
                y: item.price_order*SteamCur,
                
            });
        });
        
        
        const datasets = Object.keys(datasetsMap).map(site => ({
            label: site,
            data: datasetsMap[site],
            borderWidth: 2,
            fill: false
        }));

        
        new Chart(canvas, {
            type: 'line',
            data: {
                datasets: datasets
            },
        options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'dd.MM HH:mm'
                        }
                    }
                },

                plugins:{
                tooltip:{
                    callbacks:{
                        //currency text
                        label: (context) => {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${ReversCurrencyText}`;
                        },
                        afterBody:(context) => {
                            const data = context[0].raw;
                            
                            let lines = [];
                            // lines.push(`Price in dollars $`);
                            if(data.BotCanBuy != null && data.BotCanBuy !== '-')
                                lines.push(`Bot can buy: ${data.BotCanBuy}`);

                            if(data.OnBot != null && data.OnBot !== '-')
                                lines.push(`Items on bot: ${data.OnBot}`);
                            
                            return lines;
                        }
                    }
                }
            }
            },
            
        });
        
        return;
    }catch(err){
        console.log(err);
        const historyDiv = document.querySelector('#History');
        let langUser = localStorage.getItem('language_user') || "EN";
        const errorBlock = document.createElement('div');
        errorBlock.className = 'graph-error';
        errorBlock.style.color = 'red';
        
        errorBlock.textContent = `⚠️ ${TranslationBlock[langUser]['grapheror']}`;

        historyDiv.append(errorBlock);

        return;
    }
};



export function overPayCreate(el){
    
    const ItemName = el.itemName;
    const MainSite = el.siteName;
    const DomainMain = el.Domain;
    
    const container = document.createElement('div');
    container.id = 'mainOverPayDiv';

    
    const overPayBlock = jsob_sites_item_all[MainSite][DomainMain][ItemName]?.overpay;
    const result = [];
    const StickDiv = document.createElement('div');
    StickDiv.classList.add('StickDivOverpay');
    
    Object.entries(overPayBlock).forEach(([key,value])=>{
        if (key=='float'){
            container.appendChild(FloatOverpay(overPayBlock[key]));
        }else if(['Sticker','Charm'].includes(key)){
            const allStick = overPayBlock[key];
           
            
            allStick.forEach(el=>{
                StickDiv.append(StickersOverpay(el));
            });
            
        }
    });
    container.append(StickDiv);
    


    function StickersOverpay(el){
       
        const overPayDiv = document.createElement('div');
        overPayDiv.classList.add('StickerOverpatDiv');
        overPayDiv.innerHTML = `
        
        <img src='${steam_items_all[el.name]['image']}' title='${el.name}' id='OverpayStickersImg'>
        <span id='StickerOverpayPrice'>+${el.overprice}$</span>
        
        
        `;
        return overPayDiv;
    }

    function FloatOverpay(el){
       
        const overPayDiv = document.createElement('div');
        overPayDiv.innerHTML = `<span id='OverPayFloat'>Float: ${(parseFloat(el.float)).toFixed(5)} +${parseFloat(el.price).toFixed(2)}$</span>`
        return overPayDiv;
    }

    return container.outerHTML;

}