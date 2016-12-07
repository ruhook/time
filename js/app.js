 var initDate = [{
     type: '春节时间',
     endTime: '2017/01/28',
 }, {
     type: '放假时间',
     endTime: '2017/01/25',
 }]

 var app = new Vue({
     el: '#app',
     data: {
         items: todoStorage.fetch().length && todoStorage.fetch() || initDate,
         newItem: {},
         amendItem: {},
         error: 0,
         now: new Date().getTime(),
         added: false,
         modal: {
             del: false,
             amend: false
         },
         hold: 0
     },
     methods: {
         formate(time) {
             let day = parseInt(time / (1000 * 60 * 60 * 24));
             let hour = parseInt(time % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
             let min = parseInt(time % (1000 * 60 * 60) / (1000 * 60));
             let sec = parseInt(time % (1000 * 60) / 1000)
             return day + ' 天 ' + hour + ' 小时 ' + min + ' 分钟 ';
         },
         remaining(endTime) {
             let remain = new Date(endTime).getTime() - this.now;
             return this.formate(remain > 0 && remain || 0)
         },
         toggle() {
             this.added = !this.added;
             this.newItem = {};
             this.error = 0;
         },
         toggleModal(index) {
             this.hold = index;
             this.modal.del = !this.modal.del
         },
         saveTime() {
             let [name, time] = [this.newItem['type'], this.newItem['endTime']]
             if (name && !name.trim() || !time) {
                 this.error = 1;
                 return
             }
             let item = Object.assign({}, this.newItem)
             this.items.push(item)
             this.toggle();
         },
         deleteItem(index) {
             this.toggleModal();
             this.items.splice(index, 1)
         },
         amend(index) {
             let old = Object.assign({ key: index }, this.items[index])
             this.amendItem = old;
             this.modal.amend = true;
         },
         cancel() {
             this.amendItem = null;
             this.modal.amend = false
         },
         save() {
             let index = this.amendItem['key'];
             this.items[index] = Object.assign({}, this.amendItem);
             this.cancel();
         }
     },
     created() {
         let self = this;
         setInterval(function() {
             self.now = new Date().getTime();
         }, 1000)
     },
     watch: {
         items: todoStorage.save
     }
 })