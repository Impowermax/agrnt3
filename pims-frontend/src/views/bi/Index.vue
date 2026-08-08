<script setup lang="ts">
/**
 * BI 看板（PRD 5.6）
 * 项目概况统计 + 项目进度跟踪 + 问题分布分析
 */
import { onMounted } from 'vue'
import { Folder, Coin, OfficeBuilding, WarningFilled } from '@element-plus/icons-vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import StatCard from '@/components/business/StatCard.vue'
import ChartPie from '@/components/business/ChartPie.vue'
import ChartBar from '@/components/business/ChartBar.vue'
import ChartLine from '@/components/business/ChartLine.vue'
import { useBIStore, useProjectStore } from '@/stores'
import { formatAmount, formatAmountYi } from '@/utils/format'

const biStore = useBIStore()
const projectStore = useProjectStore()

onMounted(async () => {
  await Promise.all([biStore.fetchAll(), projectStore.fetchList()])
})
</script>

<template>
  <div class="page-container" v-loading="biStore.loading">
    <PageHeader title="BI 看板" description="项目概况统计 · 项目进度跟踪 · 问题分布分析" />

    <!-- 项目概况统计 -->
    <div class="bi__stats">
      <StatCard :value="biStore.stats?.projectTotal ?? '-'" label="投资项目总数量" unit="个" :icon="Folder" icon-bg="var(--pims-primary-light)" />
      <StatCard :value="biStore.stats ? formatAmount(biStore.stats.amountTotal) : '-'" label="项目总投资金额" unit="万元" :icon="Coin" icon-bg="#ECFDF5" />
      <StatCard
        :value="biStore.stats ? `${biStore.stats.buildingCount} 个 / ${formatAmountYi(biStore.stats.buildingAmount)} 亿` : '-'"
        label="在建项目 / 金额" :icon="OfficeBuilding" icon-bg="#FFFBEB"
      />
      <StatCard :value="biStore.stats?.issueTotal ?? '-'" label="问题总数（已公开）" unit="条" :icon="WarningFilled" icon-bg="#FEF2F2" />
    </div>

    <div class="bi__grid">
      <div class="pims-card">
        <div class="pims-card__title">项目状态分布</div>
        <ChartPie :data="biStore.statusDist" center-label="项目总数" height="300px" />
      </div>

      <div class="pims-card">
        <div class="pims-card__title">投资金额统计（万元）</div>
        <ChartBar
          v-if="biStore.amountStats"
          :categories="biStore.amountStats.cats"
          :series="[
            { name: '投资计划', data: biStore.amountStats.plan },
            { name: '批复概算', data: biStore.amountStats.budget },
            { name: '实际投资', data: biStore.amountStats.actual }
          ]"
          height="300px"
        />
      </div>

      <div class="pims-card">
        <div class="pims-card__title">各项目进度跟踪（当前所处阶段 / 12）</div>
        <ChartBar
          horizontal
          :categories="projectStore.projectList.slice(0, 8).map((p) => (p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name))"
          :series="[{ name: '当前阶段', data: projectStore.projectList.slice(0, 8).map((p) => p.stageId) }]"
          unit=" 阶段"
          height="340px"
        />
      </div>

      <div class="pims-card">
        <div class="pims-card__title">问题分布 · 按项目阶段</div>
        <ChartBar :data="biStore.issueByStage" :categories="biStore.issueByStage.map((d) => d.name)" height="300px" />
      </div>

      <div class="pims-card">
        <div class="pims-card__title">问题分布 · 按关键环节占比</div>
        <ChartPie :data="biStore.issueByStep" center-label="问题总数" height="300px" />
      </div>

      <div class="pims-card">
        <div class="pims-card__title">问题录入趋势（2026 年）</div>
        <ChartLine :data="biStore.issueTrend" height="300px" />
      </div>
    </div>

    <!-- 问题易发阶段提示 -->
    <div class="pims-card">
      <div class="pims-card__title">问题易发阶段提示</div>
      <p class="bi__tip">
        根据历史问题数据统计：<b style="color: var(--pims-danger)">施工前准备（33.3%）</b>与
        <b style="color: var(--pims-warning)">招标与合同管理（22.2%）</b>为问题高发阶段，其中「工程量清单」「合同签订」环节问题最为集中。
        建议项目实施单位在对应环节重点对照知识库注意事项与问题库案例，提前规避风险。
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.bi {
  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: var(--pims-space-4);
    margin-bottom: var(--pims-space-4);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--pims-space-4);

    @include respond-to(lg) {
      grid-template-columns: 1fr;
    }
  }

  &__tip {
    font-size: 13px;
    line-height: 2;
    color: var(--pims-text-secondary);
  }
}
</style>
