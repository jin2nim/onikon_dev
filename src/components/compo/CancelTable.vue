<template>
  <div>
    <!-- 승인여부 필터 -->
    <div class="cancelled-filter">
      <label for="status-filter">취소 승인 여부 : </label>
      <select v-model="statusFilter" id="status-filter">
        <option value="">전체</option>
        <option value="취소 완료">취소 완료</option>
        <option value="취소 대기">취소 대기</option>
      </select>
    </div>

    <!-- 테이블 -->
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in filteredData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.contact }}</td>
          <td>{{ row.eventName }}</td>
          <td>{{ row.cancelReason }}</td>
          <td>{{ row.Status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import cancelData from '../../assets/data/cancel.json'; // cancel.json 파일

const todayCancelData = ref([]);
const headers = ref(['No.', '이름', '연락처', '이벤트명', '취소 사유', '승인여부']);
const statusFilter = ref(''); // 승인여부 필터 상태

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형태로 오늘 날짜 추출

// 오늘 날짜의 데이터만 필터링
onMounted(() => {
  todayCancelData.value = cancelData.filter(item => item.cancelRequestDate === today);
});

// 필터링된 데이터를 computed로 처리
const filteredData = computed(() => {
  if (statusFilter.value) {
    return todayCancelData.value.filter(item => item.Status === statusFilter.value);
  }
  return todayCancelData.value; // 기본값 = 데이터 전체
});
</script>

<style scoped>
  .cancelled-filter {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
