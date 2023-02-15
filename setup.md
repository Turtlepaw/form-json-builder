> ### 🚧 Work in progress
> This page is in need of improvements. [Edit this page](https://github.com/antouto/form-builder/blob/master/setup.md#L2)

## Getting Started
### Local Development
First off, install node modules with yarn:

```bash
yarn
```

You can then start the API:

```bash
yarn api
```

If the API is running then you can start the next app:

```bash
yarn dev
```

### Environment Variables
```
APP_URI=http://ip:port
```

#### `APP_URI`
This should be the URL you get with `yarn api`

### Cloudflare Setup
(1) Head to the [Cloudflare Dashboard](https://dash.cloudflare.com/)

(2) Navigate to the Workers KV

![](/media/cloudflare_menu.png)

(3) Create a KV Namespace, you can name this whatever you want

![](/media/cloudflare_worker_kv.png)

(4) Go to your Cloudflare Pages project

(5) Bind the KV Namespace to your project

![](/media/cloudflare_bind_kv.png)

(6) Restart/Redeploy your app