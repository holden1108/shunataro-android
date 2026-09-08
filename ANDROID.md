# GitHubでAPKを作る

push すると GitHub Actions が APK までビルドします。手元に Android Studio も JDK も要りません。

必要なのは GitHub アカウントだけです。プライベートリポジトリで構いません。

## 1. ファイルを置く

zip の中身をプロジェクトに上書きします。`.github/` フォルダも忘れずに入れてください。これがビルドの設定です。

```
しゅな太郎/
├── .github/workflows/android.yml   ← これが今回の主役
├── capacitor.config.json           ← アプリ名とID
├── vite.config.js
├── index.html
├── package.json
└── src/
```

アプリ名を変えたいときは `capacitor.config.json` の `appName` を書き換えます。

## 2. GitHubにpushする

リポジトリを作って、ブランチ名が `main` であることを確認して push します。

```sh
git add -A
git commit -m "Androidビルドを追加"
git push
```

## 3. ビルドを待つ

GitHub のリポジトリページで **Actions** タブを開くと、ビルドが動いています。初回は10分ほどかかります。

緑のチェックが付いたら成功です。赤いバツが出たら、その実行をクリックすると、どの段階で止まったかが読めます。

## 4. APKを受け取る

受け取り方は2つあります。**タグを使うほうが断然おすすめです。**

### タグを打つ（おすすめ）

```sh
git tag v1.0.0
git push origin v1.0.0
```

ビルドが終わると、リポジトリの **Releases** に `app-debug.apk` が置かれます。スマホのブラウザで自分のリポジトリの Releases を開いて、APK をタップすればそのままダウンロードできます。PCを経由しなくて済みます。

次に更新するときは `v1.0.1` のように番号を上げてタグを打ち直します。同じタグは使えません。

### Actionsから落とす

Actions の実行結果ページの下に `shunataro-apk` という成果物があります。ただし zip で降ってくるので、PCで解凍してから端末に送る手間がかかります。

## 5. 端末に入れる

ダウンロードした APK をタップすると、「不明なアプリのインストール」を許可するか聞かれます。ブラウザやファイルアプリに対して許可すると、インストールに進めます。

これは Play ストア以外から入れるアプリすべてに出るもので、一度許可すれば次からは出ません。

## 更新するときの注意

**新しいAPKを入れる前に、古いアプリを削除してください。** 削除せずに入れようとすると「アプリがインストールされていません」と出ます。

原因は署名です。ビルドのたびに新しい鍵が作られるので、Android から見ると別のアプリ扱いになります。このアプリは端末側にデータを保存しないので、消しても失うものはありません。

毎回消すのが面倒なら、鍵を固定できます。手元に `~/.android/debug.keystore` があれば（Android Studio を使ったことがあれば存在します）、こうします。

```sh
base64 -w0 ~/.android/debug.keystore
```

出力された文字列を、リポジトリの Settings → Secrets and variables → Actions → New repository secret で、名前を `DEBUG_KEYSTORE` にして登録します。次のビルドから自動で使われ、上書きインストールできるようになります。

鍵が手元にない場合は、この設定は飛ばして構いません。削除してから入れ直す運用でも困りません。

## 困ったとき

**Actions タブに何も出ない。** ブランチ名が `main` かどうか確認してください。`master` の場合は `android.yml` の `branches: [main]` を書き換えます。

**`pnpm install` で止まる。** `pnpm-workspace.yaml` の `allowBuilds` の指定が効いている可能性があります。その2行を消すと通ります。

**`cap sync` で止まる。** `capacitor.config.json` がプロジェクトの一番上の階層にあるか確認してください。

**ビルドは通るのに、アプリが真っ白。** `vite.config.js` の `base: './'` が消えていないか確認してください。これが無いとアセットを読めません。
