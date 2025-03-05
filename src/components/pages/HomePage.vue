<template>
    <div>
        <div class="content-wrap">
            <h1 class="sub-title">Today's Reservation</h1>
            <div class="summary">
                <card :title="'금일 이벤트 수'" :number="todayData.length" />
                <div class="box">
                <h3 class="box-title">이벤트 참여 인원</h3>
                <div class="parti-wrap">
                    <div class="rate">{{ participationRate }}%</div>
                    <div class="participants">
                    <span>{{ totalParticipants }}</span> / <span>{{ totalCapacity }}</span>
                    </div>
                </div>
                <div class="progress">
                    <div class="progress-bar" :style="{ width: participationRate + '%' }"></div>
                </div>
                </div>
                <card title="금일 예약 완료" :number="totalReservations" />
                <card title="취소 요청건" :number="cancelRequests" :isRed="true" />
                <div class="box">
                    <h3 class="box-title">인기 이벤트</h3>
                    <h1>강연</h1>
                </div>
            </div>
        </div>
      
        <div class="content-wrap">
            <h1 class="sub-title">금일 이벤트 현황</h1>
            <table>
                <thead>
                    <tr>
                    <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in todayData" :key="index">
                    <td>{{ row.venue }}</td>
                    <td>{{ row.time }}</td>
                    <td>{{ row.eventName }}</td>
                    <td>{{ row.capacity }}</td>
                    <td>{{ row.cancelled }}</td>
                    <td>{{ row.capacity - row.reservations }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
  
        <div class="grid-wrap content-wrap">
            <div class="left">
                <h1 class="sub-title">금일 취소 현황</h1>
                <CancelTable/>
            </div>
            <div class="right">
                <h1 class="sub-title">일자별 예약율 (7일)</h1>
                <canvas id="reservationsChart"></canvas>
            </div>
        </div>
        <div class="grid-wrap content-wrap">
            <div class="left">
                <h1 class="sub-title">마감임박 이벤트</h1>
                <table>
            <thead>
                <tr>
                <th v-for="(header, index) in eventHeaders" :key="index">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(event, index) in ClosingEvents" :key="index">
                    <td>{{ index +1 }}</td>
                    <td>{{ event.eventName }}</td>
                    <td>{{ event.date }}</td>
                    <td>{{ event.capacity }}</td>
                    <td>{{ event.capacity - event.reservations }}</td>
                </tr>
            </tbody>
            </table>
            </div>
            <div class="right">
                <h1 class="sub-title">시간대별 예약 트랜드</h1>
            </div>
        </div>
        </div>
    </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import card from '../compo/CardCompo.vue';
  import data from '../../assets/data/reserve.json'; // reserve.json 파일
  import CancelTable from '../compo/CancelTable.vue';
  import Chart from 'chart.js/auto';
  
  const todayData = ref([]);
  const headers = ref(['장소', '시간', '이벤트명', '수용 인원', '취소 요청', '잔여 좌석']);
  const last7DaysData = ref([]); // 최근 7일 데이터
  
  const today = new Date().toISOString().split('T')[0];
  
  // 최근 7일의 데이터 필터터
  const getLast7DaysData = () => {
    const todayDate = new Date();
    const last7Days = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(todayDate);
      date.setDate(todayDate.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      last7Days.push(formattedDate);
    }
  
    last7DaysData.value = data.filter(item => last7Days.includes(item.date));
  };
  
  // 날짜별 장소별 예약율 계산
  const calcurateReserve = () => {
    const dailyRates = {};
  
    last7DaysData.value.forEach(item => {
      const date = item.date;
      const venue = item.venue;
      const reservationRate = (item.reservations / item.capacity) * 100;
  
      if (!dailyRates[date]) {
        dailyRates[date] = {};
      }
      if (!dailyRates[date][venue]) {
        dailyRates[date][venue] = [];
      }
  
      dailyRates[date][venue].push(reservationRate);
    });
  
    // 각 날짜에 2개 이상 예약이 있으면 평균치로 계산
    const averageRates = {};
    Object.keys(dailyRates).forEach(date => {
      averageRates[date] = {};
      Object.keys(dailyRates[date]).forEach(venue => {
        const rates = dailyRates[date][venue];
        const averageRate = rates.reduce((a, b) => a + b, 0) / rates.length;
        averageRates[date][venue] = averageRate;
      });
    });
  
    return averageRates;
  };
  
  // 차트 데이터 생성
  const chartData = computed(() => {
    const dailyVenueRates = calcurateReserve();
    const dates = Object.keys(dailyVenueRates); 
    const venues = Array.from(new Set(data.map(item => item.venue))); 
  
    const colorPalette = [
    'rgba(181,226,250, 1)', 
    'rgba(120,200,244, 1)', 
    'rgba(183,239,238, 1)', 
    'rgba(190,214,246, 1)', 
    'rgba(130,171,249, 1)',
    'rgba(198,207,224, 1)', 
    'rgba(199,220,230, 1)', 
  ];

    const datasets = venues.map((venue, index) => {
        return {
        label: venue,
        data: dates.map(date => dailyVenueRates[date][venue] || 0),
        borderColor: colorPalette[index % colorPalette.length], 
        backgroundColor: colorPalette[index % colorPalette.length].replace('1)', '0.2)'), // 배경색은 투명도를 낮추기
        fill: true,
        };
    });
  
    return {
      labels: dates, // 가로축 = 7일일
      datasets: datasets,
    };
  });
  
    onMounted(() => {
        todayData.value = data.filter(item => item.date === today);
        getLast7DaysData(); 
    
        const chart_data = document.getElementById('reservationsChart').getContext('2d');
        new Chart(chart_data, {
        type: 'line',
        data: chartData.value,
        options: {
            responsive: true,
            scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                max: 100, // 예약율을 기준으로 할거라 세로(Y)축은 100%를 기준으로로
            }
            }
        }
        });
    });
  
    const totalParticipants = computed(() => {
        return todayData.value.reduce((total, row) => total + row.reservations, 0);
    });
    
    const totalCapacity = computed(() => {
        return todayData.value.reduce((total, row) => total + row.capacity, 0);
    });
    
    const totalReservations = computed(() => {
        return todayData.value.reduce((total, row) => total + row.reservations, 0);
    });
    
    const cancelRequests = computed(() => {
        return todayData.value.reduce((total, row) => total + (row.capacity - row.reservations), 0);
    });
    
    const participationRate = computed(() => {
        return totalCapacity.value === 0 ? 0 : Math.round((totalParticipants.value / totalCapacity.value) * 100);
    });

    // 예약 비율 계산: 마감임박 이벤트(예약 완료 비율이 90% 이상)
    const ClosingEvents = computed(() => {
        return data
            .filter(event => {
                const reservationRate = (event.reservations / event.capacity) * 100;
                return reservationRate >= 90 && new Date(event.date) > new Date(); // 예약 완료 비율이 90% 이상이고 오늘 이후의 이벤트만
            })
            .sort((a, b) => {
                // 예약 비율을 기준으로 내림차순 정렬
                const aRate = (a.reservations / a.capacity) * 100;
                const bRate = (b.reservations / b.capacity) * 100;
                return bRate - aRate;
            });
    });

    // 마감임박 이벤트 테이블 헤더
    const eventHeaders = ref(['No.', '이벤트 명', 'Date', '수용 인원', '잔여 좌석']);


  </script>
  
  <style scoped>
  .grid-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .summary {
    width: 100%;
    justify-content: space-between;
    display: flex;
    gap: 15px;
  }
  
  .parti-wrap {
    display: flex;
    gap: 10px;
    padding-bottom: 10px;
    width:80%;
    justify-content: space-evenly;
  }
  
  .rate {
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 100%;
    background-color: orange;
    text-align: center;
    color: white;
  }
  
  .participants {
    line-height: 60px;
  }
  
  .progress {
    width: 80%;
    height: 15px;
    border-radius: 15px;
    background-color: #ccc;
    position: relative;
  }
  
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    border-radius: 15px;
    border: thin solid #ccc;
    background-color: orange;
    width: 80%;
  }
  
  canvas {
    width: 100%;
    height: 400px;
  }
  </style>
  