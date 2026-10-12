const cache=new Map();export function avatarCanvas(id){if(cache.has(id))return cache.get(id);const c=document.createElement('canvas');c.width=32;c.height=40;const g=c.getContext('2d');const skin=['#ffcf9d','#d99765','#8d573f','#edb38c','#a86f4c'][id%5],hair=['#463147','#e9b64b','#a54d38','#354a6b','#e9e9cd','#764493','#262b38'][Math.floor(id/5)%7],shirt=['#ed6573','#549bdd','#9c73d4','#4fba89','#f2ad49','#6dcdd0','#e488ba','#809a4c','#726cbb','#ea7851'][id%10],style=Math.floor(id/10)%5;const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
 r(7,37,18,2,'#24374d44');r(10,28,5,8,'#354763');r(18,28,5,8,'#354763');r(8,35,7,3,'#253046');r(18,35,8,3,'#253046');r(8,18,17,12,shirt);r(6,20,3,9,skin);r(25,20,3,9,skin);r(11,7,12,12,skin);r(9,9,2,6,skin);r(23,9,2,6,skin);r(10,5,14,5,hair);r(9,8,4,4,hair);r(13,12,2,2,'#273343');r(20,12,2,2,'#273343');r(16,16,3,1,'#a66a5b');
 if(style===0){r(8,3,16,4,shirt);r(19,6,9,2,shirt);r(12,3,3,3,'#fff5cd');r(11,20,3,9,'#f8e9b7')}
 if(style===1){r(7,8,4,14,hair);r(24,8,4,14,hair);r(25,7,4,3,'#ed698a');r(12,23,11,3,'#fff0ce');r(9,28,17,4,shirt)}
 if(style===2){r(12,1,4,6,hair);r(18,2,4,5,hair);r(11,11,6,4,'#293b52');r(18,11,6,4,'#293b52');r(16,12,2,1,'#293b52');r(13,12,2,1,'#a6e7ef');r(20,12,2,1,'#a6e7ef');r(9,20,4,12,'#f3edd9');r(21,20,4,12,'#f3edd9')}
 if(style===3){r(8,5,17,4,'#e9bc62');r(5,8,23,3,'#e9bc62');r(9,7,16,1,'#946345');r(12,22,10,9,'#5679a9');r(12,19,3,8,'#5679a9');r(20,19,2,8,'#5679a9');r(24,24,6,5,'#af7651')}
 if(style===4){r(9,5,16,4,hair);r(9,9,3,9,hair);r(23,9,3,11,hair);r(9,18,16,3,'#efdf87');r(20,20,3,8,'#efdf87');r(26,19,3,7,'#905f8d')}
 // Personal badge encodes citizen identity, including later generations.
 for(let bit=0;bit<8;bit++)if(id&(1<<bit))r(11+bit%4*2,25+Math.floor(bit/4)*2,1,1,'#fff6d8');cache.set(id,c);return c}
export function portrait(id){return avatarCanvas(id).toDataURL()}
