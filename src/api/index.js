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
