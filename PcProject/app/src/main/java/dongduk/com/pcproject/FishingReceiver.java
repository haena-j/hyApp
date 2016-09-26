package dongduk.com.pcproject;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.location.LocationManager;
import android.support.v4.app.NotificationCompat;
import android.widget.Toast;

/**
 * Created by Yeeun Jung on 2016-08-11.
 */
public class FishingReceiver extends BroadcastReceiver {
    public void onReceive(Context context, Intent intent){
        boolean bEnter = intent.getBooleanExtra(
                LocationManager.KEY_PROXIMITY_ENTERING, true);
        String brand = intent.getStringExtra("brand");
        Toast.makeText(context, bEnter ? brand + "이 근처에 있습니다" :
        "다른곳으로가세요", Toast.LENGTH_SHORT).show();

        NotificationManager notiManager //NotificationManager를 통한 Notification 설정
                = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        Notification myNoti = new NotificationCompat.Builder(context)
                .setSmallIcon(R.drawable.alarm)
                .setContentTitle(brand+"이 근처에 있습니다.")
                .setContentText("방문하세요")
                .setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.drawable.alarm))
                .setContentInfo("1")
                .setAutoCancel(true)
                .setDefaults(Notification.DEFAULT_SOUND | Notification.DEFAULT_LIGHTS)
                .setVibrate(new long[] { 1000, 1000, 500, 500, 200, 200, 200, 200, 200 }) //바이브레이션 설정!
                .build();
        notiManager.notify(100, myNoti);
    }
}
