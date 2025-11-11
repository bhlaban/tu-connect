using System.Net.Http.Json;
using System.Text.Json;
using TUConnect.Core.Models;

namespace TUConnect.Mobile.Services;

public class ApiService : IApiService
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions;

    public ApiService()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://localhost:7001/api/") // Update with actual API URL
        };

        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    // Members
    public async Task<List<Member>> GetMembersAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<List<Member>>("members", _jsonOptions);
        return response ?? new List<Member>();
    }

    public async Task<Member?> GetMemberAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<Member>($"members/{id}", _jsonOptions);
    }

    public async Task<Member> CreateMemberAsync(Member member)
    {
        var response = await _httpClient.PostAsJsonAsync("members", member);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Member>(_jsonOptions) ?? member;
    }

    public async Task UpdateMemberAsync(int id, Member member)
    {
        var response = await _httpClient.PutAsJsonAsync($"members/{id}", member);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteMemberAsync(int id)
    {
        var response = await _httpClient.DeleteAsync($"members/{id}");
        response.EnsureSuccessStatusCode();
    }

    // Volunteer Time
    public async Task<List<VolunteerTimeEntry>> GetVolunteerTimeEntriesAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<List<VolunteerTimeEntry>>("volunteertime", _jsonOptions);
        return response ?? new List<VolunteerTimeEntry>();
    }

    public async Task<List<VolunteerTimeEntry>> GetVolunteerTimeByMemberAsync(int memberId)
    {
        var response = await _httpClient.GetFromJsonAsync<List<VolunteerTimeEntry>>($"volunteertime/member/{memberId}", _jsonOptions);
        return response ?? new List<VolunteerTimeEntry>();
    }

    public async Task<VolunteerTimeEntry?> GetVolunteerTimeEntryAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<VolunteerTimeEntry>($"volunteertime/{id}", _jsonOptions);
    }

    public async Task<VolunteerTimeEntry> CreateVolunteerTimeEntryAsync(VolunteerTimeEntry entry)
    {
        var response = await _httpClient.PostAsJsonAsync("volunteertime", entry);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<VolunteerTimeEntry>(_jsonOptions) ?? entry;
    }

    public async Task UpdateVolunteerTimeEntryAsync(int id, VolunteerTimeEntry entry)
    {
        var response = await _httpClient.PutAsJsonAsync($"volunteertime/{id}", entry);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteVolunteerTimeEntryAsync(int id)
    {
        var response = await _httpClient.DeleteAsync($"volunteertime/{id}");
        response.EnsureSuccessStatusCode();
    }

    // Fishing Logs
    public async Task<List<FishingLog>> GetFishingLogsAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<List<FishingLog>>("fishinglogs", _jsonOptions);
        return response ?? new List<FishingLog>();
    }

    public async Task<List<FishingLog>> GetFishingLogsByMemberAsync(int memberId)
    {
        var response = await _httpClient.GetFromJsonAsync<List<FishingLog>>($"fishinglogs/member/{memberId}", _jsonOptions);
        return response ?? new List<FishingLog>();
    }

    public async Task<FishingLog?> GetFishingLogAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<FishingLog>($"fishinglogs/{id}", _jsonOptions);
    }

    public async Task<FishingLog> CreateFishingLogAsync(FishingLog log)
    {
        var response = await _httpClient.PostAsJsonAsync("fishinglogs", log);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<FishingLog>(_jsonOptions) ?? log;
    }

    public async Task UpdateFishingLogAsync(int id, FishingLog log)
    {
        var response = await _httpClient.PutAsJsonAsync($"fishinglogs/{id}", log);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteFishingLogAsync(int id)
    {
        var response = await _httpClient.DeleteAsync($"fishinglogs/{id}");
        response.EnsureSuccessStatusCode();
    }
}
