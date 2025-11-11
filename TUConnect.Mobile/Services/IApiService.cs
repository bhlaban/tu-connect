using TUConnect.Core.Models;

namespace TUConnect.Mobile.Services;

public interface IApiService
{
    // Members
    Task<List<Member>> GetMembersAsync();
    Task<Member?> GetMemberAsync(int id);
    Task<Member> CreateMemberAsync(Member member);
    Task UpdateMemberAsync(int id, Member member);
    Task DeleteMemberAsync(int id);

    // Volunteer Time
    Task<List<VolunteerTimeEntry>> GetVolunteerTimeEntriesAsync();
    Task<List<VolunteerTimeEntry>> GetVolunteerTimeByMemberAsync(int memberId);
    Task<VolunteerTimeEntry?> GetVolunteerTimeEntryAsync(int id);
    Task<VolunteerTimeEntry> CreateVolunteerTimeEntryAsync(VolunteerTimeEntry entry);
    Task UpdateVolunteerTimeEntryAsync(int id, VolunteerTimeEntry entry);
    Task DeleteVolunteerTimeEntryAsync(int id);

    // Fishing Logs
    Task<List<FishingLog>> GetFishingLogsAsync();
    Task<List<FishingLog>> GetFishingLogsByMemberAsync(int memberId);
    Task<FishingLog?> GetFishingLogAsync(int id);
    Task<FishingLog> CreateFishingLogAsync(FishingLog log);
    Task UpdateFishingLogAsync(int id, FishingLog log);
    Task DeleteFishingLogAsync(int id);
}
