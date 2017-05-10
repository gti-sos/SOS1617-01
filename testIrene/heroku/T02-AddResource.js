describe ('Add Data', function(){
    it('Should add a new data',function(){
        browser.get('https://sos1617-01-ipf-sandbox-sos161701ipf.c9users.io/api/v2/RestClientSS#!/');
        
        element.all(by.repeater('data in datas')).then(function(initialData){
            browser.driver.sleep(2000);
            
           
            element(by.model('newData.country')).sendKeys('Jordania');
            element(by.model('newData.year')).sendKeys('2015');
            element(by.model('newData.total')).sendKeys('20001');
            element(by.model('newData.increase')).sendKeys('20%');
            element(by.model('newData.investment')).sendKeys('32 millions');
            
            
            
            element(by.buttonText('Add')).click().then(function(){
                element.all(by.repeater('data in datas')).then(function(datass){
                    expect(datass.length).toEqual(initialData.length+1);
                });
            });
        })
    })
});