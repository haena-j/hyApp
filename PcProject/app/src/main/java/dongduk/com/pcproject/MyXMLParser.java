package dongduk.com.pcproject;

import android.util.Log;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.StringReader;
import java.util.ArrayList;

/**
 * Created by Yeeun Jung on 2016-08-09.
 */
public class MyXMLParser {

    public final static String TAG = "MyXMLParser";

    private XmlPullParser mParser = null;

    public MyXMLParser() {
        try {
            Log.i(TAG, "start XMLParser");
            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            mParser = factory.newPullParser();
        } catch (XmlPullParserException e) {
            e.printStackTrace();
        }
    }

    public ArrayList<LocDto> parse(String xml) {
        ArrayList<LocDto> resultList = new ArrayList<LocDto>();

        try {
//			String으로 전달 받은 xml 을 XmlPullParser 에 설정
            mParser.setInput(new StringReader(xml));

            int tagType = 0;
            LocDto tmpDto = new LocDto();
//			문서의 마지막이 될 때까지 읽어들이는 부분의 이벤트를 구분하여 반복 수행
            for (int eventType = mParser.getEventType();  eventType != XmlPullParser.END_DOCUMENT; eventType = mParser.next()) {
                switch (eventType) {
                    case XmlPullParser.START_DOCUMENT:
                        Log.i(TAG, "start document");
                        break;
                    case XmlPullParser.END_DOCUMENT:
                        Log.i(TAG, "end document");
                        break;
                    case XmlPullParser.START_TAG:
                        Log.i(TAG, "read start tag: " + mParser.getName());
                        //title, phone, address, latitude, longitude 태그가 있을 경우 확인한다/
                        if(mParser.getName().equals("title"))	tagType = 1;
                        else if(mParser.getName().equals("phone"))	tagType = 2;
                        else if(mParser.getName().equals("address"))	tagType = 3;
                        else if (mParser.getName().equals("latitude")) tagType = 4;
                        else if(mParser.getName().equals("longitude")) tagType = 5;


                        break;
                    case XmlPullParser.END_TAG:
                        Log.i(TAG, "read end tag: " + mParser.getName());

                        if(mParser.getName().equals("item")){
                            resultList.add(tmpDto);
                            tmpDto = new LocDto();
                        }

                        break;
                    case XmlPullParser.TEXT:
                        Log.i(TAG, "read text: " + mParser.getText());

                        //tmpDto에 넣고 마지막에 return
                        if(tagType == 1) tmpDto.setTitle(mParser.getText());
                        else if(tagType == 2)tmpDto.setPhone(mParser.getText());

                        else if (tagType == 3)tmpDto.setAddress(mParser.getText());

                        else if (tagType == 4) tmpDto.setLatitude(mParser.getText());

                        else if (tagType == 5) tmpDto.setLongitude(mParser.getText());

                        tagType = 0;
                        break;
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return resultList;
    }

}
