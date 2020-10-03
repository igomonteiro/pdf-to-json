const fs = require('fs');
const pdfParse = require('pdf-parse');

const pdffile = fs.readFileSync('fatura1.pdf');

const months = {
  jan: '01',
  fev: '02',
  mar: '03',
  abr: '04',
  mai: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  set: '09',
  out: '10',
  nov: '11',
  dez: '12'
}

const parseDate = (date) => {
  let replacedDate = date.replace(/\/\w{3}/g, months[date.substring(3)]);
  let newDate = replacedDate.substring(2) + '-' + replacedDate.substring(0, 2);
  return newDate;
} 

const parseNegativePositiveValue = (value) => value.includes('-') ? value.replace(/-/g, '') : '-' + value; 

const result = pdfParse(pdffile)
.then(data => {

  const invoiceInfo = data.text.match(/(\d\d\s\/\s)+.*/g).filter(value => !value.includes('PAGAMENTO EFETUADO'));

  const year = /^\d{2}\/\d{2}\/\d{4}$/gm.exec(data.text)[0].trim().substring(6);
  
  const obj = invoiceInfo.map(result => ({
    date: year + '-' + parseDate(/(\d\d\s\/\s)+(\w{3})/g.exec(result)[0].trim().replace(/\s/g, '')),
    description: /(?<=(\d\d\s\/\s)+(\w{3}))[\s\S]*(?=R)/g.exec(result)[0].trim(),
    value: parseNegativePositiveValue(/[1-9]\d{0,2}(\.\d{3})*,\d{2}[-]?/g.exec(result)[0].trim().replace(/,/g, '.')),
  }));

  return obj;

}).catch(err => {
  console.log(err);
});

result.then(data => {
  console.log(data);
}).catch(err => {
  console.log(err);
});