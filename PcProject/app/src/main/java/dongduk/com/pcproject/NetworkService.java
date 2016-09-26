package dongduk.com.pcproject;

/**
 * Created by jungmini on 16. 8. 22..
 */
import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

/**
 *
 */
public interface NetworkService {
    //위치알림관련- 관심리스트에서 정보가져오기
    @POST("api/getBrandFromInterestList")
    Call<List<String>> getBrandFromInterestList(@Body int member_index);
}
