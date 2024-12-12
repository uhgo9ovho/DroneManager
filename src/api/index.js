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

/**
 * 获取日报详情
 */
export const getDayReportAPI = (params) => {
  return request({
    url: `/wurenji/report/getDayReport?orgId=${params.orgId}&begin_date=${params.begin_date}`,
    method: 'get'
  })
};

/**
 * 获取周报详情
 */
export const getWeekReportAPI = (params) => {
  return request({
    url: `/wurenji/report/getWeekReport?orgId=${params.orgId}&begin_date=${params.begin_date}&end_date=${params.end_date}`,
    method: 'get'
  })
};

/**
* 报告列表接口
*/
export const getFlyRecordTableAPI = (params) => {
  return request({
    url: '/wurenji/report/getFlyRecordTable',
    method: 'post',
    data: params
  })
}
