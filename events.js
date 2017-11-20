const indicatorHandle = document.getElementById('indicator-place');

const handles = {};
handles.productCode = document.getElementById('product-code');
handles.productSelect = document.getElementById('select-product');
handles.urlMenu = document.getElementById('url-menu');
handles.databaseMenu = document.getElementById('database-menu');
handles.urlForm = document.getElementById('url-form');
handles.databaseForm = document.getElementById('database-form');
handles.searchProduct = document.getElementById('search-product');
handles.loadProduct = document.getElementById('load-product');
handles.updateProducts = document.getElementById('update-products');
handles.etl = document.getElementById('etl');
handles.extract = document.getElementById('extract');
handles.transform = document.getElementById('transform');
handles.load = document.getElementById('load');
handles.toJSON = document.getElementById('to-json');
handles.toCSV = document.getElementById('to-csv');
handles.back = document.getElementById('back');
handles.panelHandleArray = document.querySelectorAll('.panel');

handles.urlMenu.addEventListener('click', function () { controller.changeMode(Mode.CENEO); });
handles.databaseMenu.addEventListener('click', function () { controller.changeMode(Mode.DATABASE); });
handles.searchProduct.addEventListener('click', function () { controller.showProductInfoFromUrl(handles.productCode.value); });
handles.loadProduct.addEventListener('click', function () { controller.showProductInfoFromDatabase(handles.productSelect.value); });
handles.updateProducts.addEventListener('click', function () { controller.updateProductsAsync(); });
handles.etl.addEventListener('click', function () { controller.extractData(true); });
handles.extract.addEventListener('click', function () { controller.extractData(); });
handles.transform.addEventListener('click', function () { controller.transformData(); });
handles.load.addEventListener('click', function () { controller.loadData(); });
handles.back.addEventListener('click', function () { controller.clearData(); });