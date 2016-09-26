package dongduk.com.pcproject;

import android.app.ActionBar;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends ActionBarActivity {
    private WebView webView;

    private NetworkService networkService;
    Intent intent;

    //위치알림기능을 위한 변수들
    private ArrayList<LocDto> resultList;
    private String resultXml;
    double latitude, longitude;
    LocationManager locManager;
    Geocoder mCoder;
    String str_lat;
    String str_lng;
    PendingIntent mPending;
    ArrayList<String> str;

    //파일업로드를 위한 변수
    private static final int RC_FILE_CHOOSE = 1;
    private static final int RC_FILE_CHOOSE_LOLLIPOP = 2;
    private ValueCallback<Uri> mUploadMsg = null;
    private ValueCallback<Uri> filePathCallbackNormal;
    private ValueCallback<Uri[]> filePathCallbackLollipop;
    private Uri mCapturedImageURI;

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == RC_FILE_CHOOSE) {
            if (filePathCallbackNormal == null) return;
            Uri result = (data == null || resultCode != RESULT_OK) ? null : data.getData();
            filePathCallbackNormal.onReceiveValue(result);
            filePathCallbackNormal = null;
        } else if (requestCode == RC_FILE_CHOOSE_LOLLIPOP) {
            Uri[] result = new Uri[0];
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                if(resultCode == RESULT_OK){
                    result = (data == null) ? new Uri[]{mCapturedImageURI} : WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                }
                filePathCallbackLollipop.onReceiveValue(result);
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //웹뷰를 이용해 웹서버에 접속
        webView = (WebView)findViewById(R.id.webView);

        webView.loadUrl("http://52.79.133.27");
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        webView.setWebViewClient(new myWebClient());

        webView.setWebChromeClient(new WebChromeClient() { //  파일 업로드를 위한 함수 (<index type="file")
            // For Android < 3.0
            public void openFileChooser(ValueCallback<Uri> uploadMsg) {
                openFileChooser(uploadMsg, "");
            }

            // For Android 3.0+
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
                filePathCallbackNormal = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                startActivityForResult(Intent.createChooser(i, "File Chooser"), RC_FILE_CHOOSE);
            }

            // For Android 4.1+
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
                openFileChooser(uploadMsg, acceptType);
            }

            // For Android 5.0+
            public boolean onShowFileChooser(
                    WebView webView, ValueCallback<Uri[]> filePathCallback,
                    WebChromeClient.FileChooserParams fileChooserParams) {
                if (filePathCallbackLollipop != null) {
//                    filePathCallbackLollipop.onReceiveValue(null);
                    filePathCallbackLollipop = null;
                }
                filePathCallbackLollipop = filePathCallback;

                // Create AndroidExampleFolder at sdcard
                File imageStorageDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "AndroidExampleFolder");
                if (!imageStorageDir.exists()) {
                    // Create AndroidExampleFolder at sdcard
                    imageStorageDir.mkdirs();
                }

                // Create camera captured image file path and name
                File file = new File(imageStorageDir + File.separator + "IMG_" + String.valueOf(System.currentTimeMillis()) + ".jpg");
                mCapturedImageURI = Uri.fromFile(file);

                Intent captureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                captureIntent.putExtra(MediaStore.EXTRA_OUTPUT, mCapturedImageURI);

                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");

                // Create file chooser intent
                Intent chooserIntent = Intent.createChooser(i, "Image Chooser");
                // Set camera intent to file chooser
                chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Parcelable[]{captureIntent});

                // On select image call onActivityResult method of activity
                startActivityForResult(chooserIntent, RC_FILE_CHOOSE_LOLLIPOP);
                return true;

            }
        });

        //ip,port 연결
        try{
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("http://52.79.133.27:8080")
                    .addConverterFactory(GsonConverterFactory.create()).build();

            networkService = retrofit.create(NetworkService.class);

        } catch (Exception e) {
            e.printStackTrace();
        }

        //위치알림기능 - Intellij에서 관심리스트 가져오기
        Call<List<String>> listCall = networkService.getBrandFromInterestList(3);

        Log.i("MYTAG", "3");
        listCall.enqueue(new Callback<List<String>>() {


            @Override
            public void onResponse(Call<List<String>> call, Response<List<String>> response) {
                if (response.isSuccessful()) {
                    List<String> brandList = response.body();
                    Log.i("MYTAG", "4");

                    str = new ArrayList();
                    for (int i = 0; i < brandList.size(); i++) {
                        str.add(i, brandList.get(i));
                    }
                } else {
                    Log.i("MYTAG", "5");
                }
            }

            @Override
            public void onFailure(Call<List<String>> call, Throwable t) {

                Log.i("MYTAG", t.getMessage());

            }
        });

        //레이아웃의 googleMap 준비
        mCoder = new Geocoder(this);

        locManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        intent = new Intent(this, FishingReceiver.class);


        //실내에서 실행시 GPS 가 ON으로 되있는데 GPS가 bestProvider가 되면 검색이 안잡히는 경우가 있어서 일단 NETWORK 이용!!!
        locManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1500, 0, locListener); //위치정보 확인
        boolean gpsOn = locManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        boolean networkOn = locManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);


        TimerTask adTast = new TimerTask() {

            public void run() {

                String url;
                NetworkManager netManager;
                for (int i = 0; i < str.size(); i++) {
                    url = "https://apis.daum.net/local/v1/search/keyword.xml?apikey=1516115ec314a5b7745a9deb2e30158a74e3a58e&radius=10000&query=";
                    url += encodeKorean(str.get(i)) + "&location=" + str_lat + "," + str_lng;
                    netManager = new NetworkManager(MainActivity.this, mXmlHandler, url); //NetworkManager 실행
                    netManager.setDaemon(true);
                    netManager.start();
                }
            }
        };

        Timer timer = new Timer();
        timer.schedule(adTast, 3000, 30000); // 100초후 첫실행, 300초마다 계속실행
    }
    public void onResume() {
        super.onResume();
    }
    public void onPause() {
        super.onPause();
    }

    Handler mXmlHandler = new Handler() {
        public void handleMessage(Message msg) { //화장품가게 검색 api 실행시
            resultXml = (String) msg.obj; //result 값 저장
            MyXMLParser parser = new MyXMLParser(); //파서 실행
            resultList = parser.parse(resultXml);
            for(LocDto dto : resultList) {
                intent.putExtra("brand",dto.getTitle());

                mPending = PendingIntent.getBroadcast(MainActivity.this, 0, intent, 0);
                locManager.addProximityAlert(latitude, longitude,1500, -1, mPending);//위치반경 임의로 1500
                break;//알람한번만울리고 break
            }
        }
    };

    private String encodeKorean(String target) {
        String encodedTarget = null;
        try  {
            encodedTarget = URLEncoder.encode(target, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return encodedTarget;
    }

    LocationListener locListener = new LocationListener() {

        // 위치 변경 시마다 호출
        @Override
        public void onLocationChanged(Location loc) {
            latitude = loc.getLatitude();	// 위도 확인
            longitude = loc.getLongitude();	// 경도 확인
            str_lat = Double.toString(latitude);
            str_lng = Double.toString(longitude);
        }

        //현재 위치제공자가 사용이 불가해질 때 호출
        @Override
        public void onProviderDisabled(String provider) {
        }

        //현재 위치제공자가 사용가능해질 때 호출
        @Override
        public void onProviderEnabled(String provider) {
        }

        //위치제공자의 상태가 변할 때 호출
        @Override
        public void onStatusChanged(String provider, int status, Bundle extra) {
            String sStatus = "";
            switch(status) {
                case LocationProvider.OUT_OF_SERVICE:
                    sStatus = "범위 벗어남";
                    break;
                case LocationProvider.TEMPORARILY_UNAVAILABLE:
                    sStatus = "일시적 불능";
                    break;
                case LocationProvider.AVAILABLE:
                    sStatus = "사용 가능";
                    break;
            }
        }
    };

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // Check if the key event was the Back button and if there's history
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        // If it wasn't the Back key or there's no web page history, bubble up to the default
        // system behavior (probably exit the activity)
        return super.onKeyDown(keyCode, event);
    }

    public class myWebClient extends WebViewClient
    {
        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            // TODO Auto-generated method stub
            super.onPageStarted(view, url, favicon);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            // TODO Auto-generated method stub

            view.loadUrl(url);
            return true;

        }

        @Override
        public void onPageFinished(WebView view, String url) {
            // TODO Auto-generated method stub
            super.onPageFinished(view, url);


        }
    }



}

