import request from '@/utils/request';


/**
 * 获取首页统计数据接口
 */
export const getstatisticsDataAPI = (params) => {
  return request({
    url: `/wurenji/record/getstatisticsData?orgId=${params.orgId}&startTime=${params.startTime}&endTime=${params.endTime}`,
    method: 'get'
  })
}
