const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'
axios.interceptors.request.use(function(config) {
    config.headers.common.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    console.log(config);
    return config
})

axios.interceptors.response.use(function (response) {
    alert('sucesso')
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    alert('ERRO')
    return Promise.reject(error);
  });

  const $http = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });
  $http.defaults.headers.common['Authorization'] = '$http';



const get = () => {
    const config = {
        params: {
            _limit: 5
        }
    };
    $http.get('/posts', config)
         .then((response) => renderOutput(response))
}

const post = () => {
    const data = {
        title: 'Everton',
        body: 'bar',
        userId: 1,
    };
    axios.post('posts', data)
         .then((response) => renderOutput(response))
    
}

const put = () => {
    const data = {
        title: 'Everton',
        body: 'bar',
        userId: 1,
    };

    axios.put('posts/1', data)
         .then((response) => renderOutput(response))
}

const patch = () => {
    const data = {
        body: 'Henrique',
        userId: 1,
    };

    axios.patch('posts/2', data)
         .then((response) => renderOutput(response))
}

const del = () => {
    axios.delete('posts/2')
        .then((response) => renderOutput(response))
}

const multiple = () => {
   Promise.all([
     axios.get('posts?_limit=5'),
     axios.get('users?_limit=5')
   ]).then((response) => {
    console.table(response[0].data)    
    console.table(response[1].data)
   })
}

const transform = () => {
    const config = {
        params: {
            _limit: 5
        },
        transformResponse: [function (data) {
            const payload = JSON.parse(data).map(o => {
                return {
                   ...o,
                   is_selected: false,
                }                
            })
            return payload;
          }],
        
    };
    axios.get('posts', config)
         .then((response) => renderOutput(response))

}

const errorHandling = () => {
    axios.get('posts')
         .then((response) => renderOutput(response))
         .catch((error) => {renderOutput(error.response)
        
    })
}

const cancel = () => {
    const controller = new AbortController();
    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    };
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
         .then((response) => renderOutput(response))
         .catch((e) => {
            console.log(e.message)
         })
         controller.abort()

}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
