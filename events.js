const indicatorHandle = document.getElementById('indicator-place');
const handles = {
    productIdElement: document.getElementById('productIdValue')
};

handles.search = document.getElementById('search');
handles.search.addEventListener('click', function () {
    controller.showProductInfoAsync(handles.productIdElement.value);
});

// zdarzenie kliknięcia w przycisk Pobieranie
handles.fromURL = document.getElementById('fromURL');
handles.fromURL.addEventListener('click', function () {
    $(event.target).addClass("active");
    $(handles.fromDatabase).removeClass("active");
    controller.setAppMode(Mode.URL);
});

// zdarzenie kliknięcia w przycisk Wczytywanie
handles.fromDatabase = document.getElementById('fromDatabase');
handles.fromDatabase.addEventListener('click', function () {
    $(event.target).addClass("active");
    $(handles.fromURL).removeClass("active");
    controller.setAppMode(Mode.DATABASE);
});

// zdarzenie kliknięcia w przycisk ETL
handles.etl = document.getElementById('etl');
handles.etl.addEventListener('click', function () {
    // TODO: to implement (w metodach dodać parametr isAutoNextStage)
});

// zdarzenie kliknięcia w przycisk Extract
handles.extract = document.getElementById('extract');
handles.extract.addEventListener('click', function () {
    $(event.target).addClass("disabled");
    controller.extractData();
});

// zdarzenie kliknięcia w przycisk Transform
handles.transform = document.getElementById('transform');
handles.transform.addEventListener('click', function () {
    $(event.target).addClass("disabled");
    controller.transformData();
});

// zdarzenie kliknięcia w przycisk Load
handles.load = document.getElementById('load');
handles.load.addEventListener('click', function () {
    $(event.target).addClass("disabled");
    controller.loadData();
});

// zdarzenie kliknięcia w przycisk Wprowadź następne
handles.nextSearch = document.getElementById('next');
handles.nextSearch.addEventListener('click', function () {
    $(event.target).addClass("disabled");
    controller.clearData();
    controller.changeAppStatus(AppStatus.NONE);
});