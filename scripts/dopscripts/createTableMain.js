import { steam_icon_url,steam_items_all,jsob_sites_item_all,SitesInfo,CurAscii,ReversCurrency,SitesCurrency,SteamCurrency,TranslationBlock } from '../jsons/jsones_all.js';
import { calculateTimestamsShort } from './background.js';
import { ActiveGetStorage } from './picSites.js';
import { historySitesAll } from '../jsons/history.js';

export class CreateMainTable{

    constructor(data){
        this.leftSite = data.leftSite;
        this.rightSite = data.site_name;
        this.domain = data.domain;
    }
    createMainTB(){
        try{
         
            document.querySelector('#mainTableDiv_Edit')?.remove();
            document.querySelector("#GrandItemDivFind")?.remove();
            const MainCurrency = ActiveGetStorage('currency');
            
            const mainTableDiv = document.createElement('div');
            const headHelpDiv = document.createElement('div');
            const RowContainerDiv = document.createElement('div');
            mainTableDiv.id = 'mainTableDiv_Edit';
            mainTableDiv.classList.add('mainTableDiv');
            RowContainerDiv.classList.add('RowContanerDiv');
            //Head block
            headHelpDiv.classList.add('headHelpDiv');
            
            headHelpDiv.innerHTML = `
                <span class='RowInfo' id='SiteName' data-domain='${this.domain}' data-sitename='${this.rightSite}'>${this.rightSite} ${TranslationBlock['ru']['domain'][this.domain]}</span>
                <span class='RowInfo'>Update:${(SitesInfo[this.rightSite]['timeupdate'][this.domain]).slice(0,16)}</span>
                ${SitesInfo[this.rightSite]?.promo 
                ?`<span class='RowInfo'>Promo: ${SitesInfo[this.rightSite].promo}</span>` : ''}
                <button title='Сортировка' class='Sort' id="SortItemInTable">↓☰↑</button>
                <a class='RowInfo' style='color:red;font-size:14px' href="${SitesInfo[this.rightSite]['url']}" target="_blank">${TranslationBlock['ru']['GoSite']}</a>
                ${SitesInfo[this.rightSite]?.comment
                    ?`<span title='site info' id='CommentDev' style='cursor:pointer;color:red' class="RowInfo">!</span>` : ''}
        `;
            Object.entries(jsob_sites_item_all[this.rightSite][this.domain]).forEach(([key,value])=>{
                if(value['active'] == 'true'){
                 
                    const RowDivItemInfo = document.createElement('div');
                    RowDivItemInfo.classList.add('rowDiv');
                    let steam_price_check = steam_items_all[key] ? parseFloat(steam_items_all[key]['price']) : 0;
                    
                    if(steam_price_check == 0){
                        return;
                    }
                    let SteamCur = CurAscii[steam_items_all[key]['currency']];
                    let steam_price = steam_price_check / (SteamCurrency[SteamCur]);
                    let steam_dollar_price = parseFloat(steam_items_all[key]['dollarPrice']);
                    
                    let Procent = parseFloat((parseFloat(jsob_sites_item_all[this.rightSite][this.domain][key].price - parseFloat(steam_dollar_price))/parseFloat(steam_dollar_price))*100).toFixed(2);    
                    
                    RowDivItemInfo.innerHTML = `
                    <div class="RowDivItem">
                        <img class='imgSteamPic itemInRow' data-domain='${this.domain}' data-skinname='${key}' src=${steam_items_all[key].image}></img>
                        <span style="color:white;font-size: 24px;cursor: pointer" id='ItemInRow' data-name='${key}'>${key} </span>
                    </div>
                    <div class='RowDivItem'>
                        <img class="imgSteamPic itemInRow" src="${steam_icon_url}">
                        <span class="smalRowInfo" id='ItemInRowSteam'data-dollarprice='${parseFloat(steam_items_all[key]['dollarPrice'])}' data-price='${(parseFloat(steam_dollar_price)*parseFloat(SteamCurrency[MainCurrency]))}'>${(parseFloat(steam_dollar_price)*parseFloat(SteamCurrency[MainCurrency])).toFixed(2)}${ReversCurrency[MainCurrency]}</span>
                        <span class="smalRowInfo" id="time">(${calculateTimestamsShort(steam_items_all[key].timestamp)})</span>
                        <img class='imgSteamPic itemInRow' src='${SitesInfo[this.rightSite].icon}'>
                        <span class='smalRowInfo' id='ItemInRow'data-dollarprice='${jsob_sites_item_all[this.rightSite][this.domain][key].price}' data-price='${jsob_sites_item_all[this.rightSite][this.domain][key].price}'>${((jsob_sites_item_all[this.rightSite][this.domain][key].price)*parseFloat(SitesCurrency[MainCurrency])).toFixed(2)}${ReversCurrency[MainCurrency]}</span>
                        <span id='Procent' data-procent=${Procent} style='color:${Procent>0? 'green' : 'red'}'>${Procent > 0? '+' : ''}${Procent}%</span>
                        ${jsob_sites_item_all[this.rightSite][this.domain][key]?.maxBotGetItem?`<span title='Бот готов принять ${jsob_sites_item_all[this.rightSite][this.domain][key].maxBotGetItem} шт' class='smalRowInfo'>🤖 ${jsob_sites_item_all[this.rightSite][this.domain][key].maxBotGetItem}</span>` : ""}
                        <span style='cursor:pointer' id='GraphFind'>📊</spam>
                    </div>
                    
                    
                    `
                    ;
                    RowContainerDiv.append(RowDivItemInfo);

                }
            });

            mainTableDiv.append(headHelpDiv,RowContainerDiv);
            document.body.append(mainTableDiv);
        }catch(err){
        console.log(err);
        }}
}
export function CreateFilter(){
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
    document.querySelector('#Comment')?.remove();

    const Comment = document.createElement('div');
    const headDiv = document.querySelector('.headHelpDiv');
    const site_name_find = headDiv.querySelector('#SiteName');
    const site_name = site_name_find.dataset.sitename;
    Comment.id = 'Comment';
    Comment.innerHTML = `<span class='RowInfo'>${SitesInfo[site_name]['comment']}</span>`;
    headDiv.append(Comment);
    return;
}

export function CreateGraph(e) {
    const MainSite = document.querySelector('#SiteName')?.dataset['sitename'];
    const DomainMain = document.querySelector('#SiteName')?.dataset['domain'];
   
    const result = [];
    document.querySelector('#History')?.remove();
    const rowDiv = e.target.closest('.rowDiv');
    const itemName = rowDiv.querySelector('[data-skinname]').dataset.skinname;
    const historyDiv = document.createElement('div');
    historyDiv.id = 'History';

    const canvas = document.createElement('canvas');
    canvas.id ='CanvasActive';
    historyDiv.append(canvas);
    rowDiv.append(historyDiv);

    // собираем данные
    
    const SteamData =  historySitesAll['steam']['main'][itemName];
    
    const itemData = historySitesAll[MainSite][DomainMain][itemName];
    console.log(itemData);
    

    if (!itemData) return;

    
    const datasetsMap = {};
    
    itemData.forEach(item => {
        const key = `${MainSite} (${DomainMain})`;

        if (!datasetsMap[key]) {
            datasetsMap[key] = [];
        }

        datasetsMap[key].push({
            x: new Date(item.time * 1000),
            y: item.price,
            BotCanBuy: item.maxBotGetItem ?? null,
            OnBot: item.OnBot ?? null,
        });
    });
    SteamData.forEach(item => {
        const key = `Steam`;
        if (!datasetsMap[key]) {
            datasetsMap[key] = [];
        }

        datasetsMap[key].push({
            x: new Date(item.time * 1000),
            y: item.price
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
                        afterBody:(context) => {
                            const data = context[0].raw;
                            
                            let lines = [];
                            lines.push(`Price in dollars $`);
                            if(data.BotCanBuy != null && data.BotCanBuy !== '-')
                                lines.push(`Bot can buy: ${data.BotCanBuy}`);

                            if(data.OnBot != null && data.OnBot !== '-')
                                lines.push(`Items on bot: ${data.OnBot}`);
                            
                            return lines;
                        }
                    }
                }
            }
        }
    });
};